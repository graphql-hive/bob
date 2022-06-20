import globby from "globby";
import * as fse from "fs-extra";
import pLimit from "p-limit";
import fs from "fs-extra";
import { DepGraph } from "dependency-graph";
import { resolve, join, dirname } from "path";
import { Consola } from "consola";
import ncc from "@vercel/ncc";
import { build as tsup } from "tsup";
import { spawn } from "child_process";

import { createCommand } from "../command";
import { BobConfig } from "../config";

export const distDir = "dist";

interface BuildOptions {
  bin?: string;
  tags?: string[];
  runify?: boolean;
  tsup?: boolean;
  external?: string[];
  banner?: string;
}

export const runifyCommand = createCommand<
  {},
  {
    tag?: string[];
  }
>((api) => {
  const { config, reporter } = api;

  return {
    command: "runify",
    describe: "Runify",
    builder(yargs) {
      return yargs.options({
        tag: {
          describe: "Run only for following tags",
          array: true,
          type: "string",
        },
      });
    },
    async handler({ tag }) {
      const [rootPackageJSONPath] = await globby("package.json", {
        cwd: process.cwd(),
        absolute: true,
      });
      const rootPackageJSON: Record<string, unknown> = await fse.readJSON(
        rootPackageJSONPath
      );
      const isSinglePackage =
        Array.isArray(rootPackageJSON.workspaces) === false;

      if (isSinglePackage) {
        return runify(join(process.cwd(), "package.json"), config, reporter);
      }

      const limit = pLimit(1);
      const packageJsonFiles = await globby("packages/**/package.json", {
        cwd: process.cwd(),
        absolute: true,
        ignore: ["**/node_modules/**", `**/${distDir}/**`],
      });

      const packageJsons = await Promise.all(
        packageJsonFiles.map((packagePath) => fs.readJSON(packagePath))
      );
      const depGraph = new DepGraph<{ path: string; tags: string[] }>();

      packageJsons.forEach((pkg, i) => {
        depGraph.addNode(pkg.name, {
          path: packageJsonFiles[i],
          tags: pkg.buildOptions?.tags ?? [],
        });
      });

      packageJsons.forEach((pkg) => {
        [
          ...Object.keys(pkg.dependencies ?? {}),
          ...Object.keys(pkg.peerDependencies ?? {}),
          ...Object.keys(pkg.devDependencies ?? {}),
        ]
          .filter((dep) => depGraph.hasNode(dep))
          .forEach((dep) => {
            depGraph.addDependency(pkg.name, dep);
          });
      });

      const ordered = depGraph.overallOrder();

      await Promise.all(
        ordered.map((name) => {
          const data = depGraph.getNodeData(name);

          if (tag) {
            if (!data.tags.some((t) => tag.includes(t))) {
              return;
            }
          }

          return limit(() =>
            runify(depGraph.getNodeData(name).path, config, reporter)
          );
        })
      );
    },
  };
});

async function runify(
  packagePath: string,
  _config: BobConfig,
  reporter: Consola
) {
  const cwd = packagePath.replace("/package.json", "");
  const pkg = await readPackageJson(cwd);
  const buildOptions: BuildOptions = pkg.buildOptions || {};

  if (!buildOptions.runify) {
    return;
  }

  if (isNext(pkg)) {
    await buildNext(cwd);
    await rewritePackageJson(pkg, cwd, (newPkg) => ({
      ...newPkg,
      dependencies: pkg.dependencies,
    }));
  } else {
    await compile(
      cwd,
      buildOptions.bin ?? "src/index.ts",
      buildOptions,
      Object.keys(pkg.dependencies ?? {}),
      pkg.type === "module"
    );
    await rewritePackageJson(pkg, cwd);
  }

  reporter.success(`Built ${pkg.name}`);
}

export async function readPackageJson(baseDir: string) {
  return JSON.parse(
    await fs.readFile(resolve(baseDir, "package.json"), {
      encoding: "utf-8",
    })
  );
}

async function rewritePackageJson(
  pkg: Record<string, any>,
  cwd: string,
  modify?: (pkg: any) => any
) {
  let filename = "index.js";

  // only tsup keep the file name
  if (pkg.buildOptions.bin && pkg.buildOptions.tsup) {
    const bits = pkg.buildOptions.bin.split("/");
    const lastBit = bits[bits.length - 1];

    filename = lastBit.replace(".ts", ".js");
  }

  let newPkg: Record<string, any> = {
    bin: filename,
  };
  const fields = [
    "name",
    "version",
    "description",
    "publishConfig",
    "registry",
    "repository",
    "type",
  ];

  fields.forEach((field) => {
    if (typeof pkg[field] !== "undefined") {
      newPkg[field] = pkg[field];
    }
  });

  if (modify) {
    newPkg = modify(newPkg);
  }

  await fs.writeFile(
    join(cwd, "dist/package.json"),
    JSON.stringify(newPkg, null, 2),
    {
      encoding: "utf-8",
    }
  );
}

function isNext(pkg: any): boolean {
  return pkg?.dependencies?.next || pkg?.devDependencies?.next;
}

async function buildNext(cwd: string) {
  await new Promise((resolve, reject) => {
    const child = spawn("next", ["build"], {
      stdio: "inherit",
      cwd,
    });
    child.on("exit", (code) => (code ? reject(code) : resolve(code)));
    child.on("error", reject);
  });

  await fs.mkdirp(join(cwd, "dist"));
  await Promise.all([
    fs.copy(join(cwd, ".next"), join(cwd, "dist/.next"), {
      filter(src) {
        // copy without webpack cache (it's 900mb...)
        return src.includes("cache/webpack") === false;
      },
    }),
    fs.copy(join(cwd, "public"), join(cwd, "dist/public")),
    fs.writeFile(
      join(cwd, "dist/index.js"),
      [
        `#!/usr/bin/env node`,
        `process.on('SIGTERM', () => process.exit(0))`,
        `process.on('SIGINT', () => process.exit(0))`,
        `
          require('next/dist/server/lib/start-server').startServer({
            dir: __dirname,
            hostname: '0.0.0.0',
            port: parseInt(process.env.PORT)
          }).then(async (app)=>{
            const appUrl = 'http://' + app.hostname + ':' + app.port;
            console.log('started server on '+ app.hostname + ':' + app.port + ', url: ' + appUrl);
            await app.prepare();
          }).catch((err)=>{
            console.error(err);
            process.exit(1);
          })
        `,
      ].join("\n")
    ),
  ]);
}

async function compile(
  cwd: string,
  entryPoint: string,
  buildOptions: BuildOptions,
  dependencies: string[],
  useEsm = false
) {
  if (buildOptions.tsup) {
    const out = join(cwd, "dist");

    await tsup({
      entryPoints: [join(cwd, entryPoint)],
      outDir: out,
      target: "node16",
      format: [useEsm ? "esm" : "cjs"],
      splitting: false,
      sourcemap: true,
      clean: true,
      skipNodeModulesBundle: false,
      noExternal: dependencies,
      external: buildOptions.external,
      banner: buildOptions.banner
        ? {
            js:
              buildOptions.banner.includes(".js") ||
              buildOptions.banner.includes(".mjs")
                ? await fs.readFile(join(cwd, buildOptions.banner), "utf-8")
                : buildOptions.banner,
          }
        : {},
    });

    return;
  }

  const { code, map, assets } = await ncc(join(cwd, entryPoint), {
    cache: false,
    sourceMap: true,
  });

  await fs.mkdirp(join(cwd, "dist"));
  await Promise.all(
    [
      fs.writeFile(join(cwd, "dist/index.js"), code, {
        encoding: "utf-8",
      }),
      fs.writeFile(join(cwd, "dist/index.js.map"), map, {
        encoding: "utf-8",
      }),
    ].concat(
      Object.keys(assets).map(async (filepath) => {
        if (filepath.endsWith("package.json")) {
          return Promise.resolve();
        }
        await fs.ensureDir(dirname(join(cwd, "dist", filepath)), {});
        await fs.writeFile(
          join(cwd, "dist", filepath),
          assets[filepath].source
        );
      })
    )
  );
}
