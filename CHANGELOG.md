# Changelog

## 5.0.0

### Major Changes

- [#167](https://github.com/kamilkisiela/bob/pull/167)
  [`d095697`](https://github.com/kamilkisiela/bob/commit/d0956978c70419c9f5203b3d8f85028589a51e66)
  Thanks [@B2o5T](https://github.com/B2o5T)! - bundle bob in esm instead cjs

### Minor Changes

- [#160](https://github.com/kamilkisiela/bob/pull/160)
  [`9ce6e27`](https://github.com/kamilkisiela/bob/commit/9ce6e279f362b78a6e925f1e038a1b611931ad55)
  Thanks [@B2o5T](https://github.com/B2o5T)! - Support pnpm workspaces from `pnpm-workspace.yaml`..
  Throw an error in case both `pnpm-workspace.yaml` and `package.json#workspaces` fields exist. Add
  missing dependency `execa`. Cleanup and remove unused dependencies.

### Patch Changes

- [#145](https://github.com/kamilkisiela/bob/pull/145)
  [`a4ebd65`](https://github.com/kamilkisiela/bob/commit/a4ebd655dd76c8703edb64605f0de2dd58870263)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:

  - Updated dependency
    [`rollup-plugin-typescript2@^0.34.0` ↗︎](https://www.npmjs.com/package/rollup-plugin-typescript2/v/0.34.0)
    (from `^0.33.0`, in `dependencies`)

- [#150](https://github.com/kamilkisiela/bob/pull/150)
  [`e18b500`](https://github.com/kamilkisiela/bob/commit/e18b500cc3807d7a76ad38639ef1cc59c1eab987)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:

  - Updated dependency
    [`@vercel/ncc@^0.36.0` ↗︎](https://www.npmjs.com/package/@vercel/ncc/v/0.36.0) (from `^0.34.0`,
    in `dependencies`)

- [#154](https://github.com/kamilkisiela/bob/pull/154)
  [`616e125`](https://github.com/kamilkisiela/bob/commit/616e1254ba3b3db638a2030abd244a50ff6ddb2b)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:

  - Updated dependency
    [`@rollup/plugin-json@^6.0.0` ↗︎](https://www.npmjs.com/package/@rollup/plugin-json/v/6.0.0)
    (from `^4.1.0`, in `dependencies`)

- [#167](https://github.com/kamilkisiela/bob/pull/167)
  [`d095697`](https://github.com/kamilkisiela/bob/commit/d0956978c70419c9f5203b3d8f85028589a51e66)
  Thanks [@B2o5T](https://github.com/B2o5T)! - dependencies updates:
  - Updated dependency [`execa@6.1.0` ↗︎](https://www.npmjs.com/package/execa/v/6.1.0) (from
    `5.1.1`, in `dependencies`)
  - Updated dependency [`globby@^13.1.3` ↗︎](https://www.npmjs.com/package/globby/v/13.1.3) (from
    `^11.0.0`, in `dependencies`)
  - Updated dependency [`p-limit@^4.0.0` ↗︎](https://www.npmjs.com/package/p-limit/v/4.0.0) (from
    `^3.1.0`, in `dependencies`)
  - Updated dependency [`yargs@^17.6.2` ↗︎](https://www.npmjs.com/package/yargs/v/17.6.2) (from
    `^17.5.1`, in `dependencies`)
  - Updated dependency [`zod@^3.20.2` ↗︎](https://www.npmjs.com/package/zod/v/3.20.2) (from
    `^3.17.3`, in `dependencies`)

## 4.1.1

### Patch Changes

- [#151](https://github.com/kamilkisiela/bob/pull/151)
  [`4695d0b`](https://github.com/kamilkisiela/bob/commit/4695d0b4f1bf849d87f626f97445b9b9b5bb9cba)
  Thanks [@kamilkisiela](https://github.com/kamilkisiela)! - dependencies updates:

  - Updated dependency [`tsup@^6.5.0` ↗︎](https://www.npmjs.com/package/tsup/v/6.5.0) (from
    `^5.11.6`, in `dependencies`)

- [#151](https://github.com/kamilkisiela/bob/pull/151)
  [`4695d0b`](https://github.com/kamilkisiela/bob/commit/4695d0b4f1bf849d87f626f97445b9b9b5bb9cba)
  Thanks [@kamilkisiela](https://github.com/kamilkisiela)! - Support TypeScript 4.9 and satisfies
  operator

## 4.1.0

### Minor Changes

- [#123](https://github.com/kamilkisiela/bob/pull/123)
  [`b68da59`](https://github.com/kamilkisiela/bob/commit/b68da59ef41d4d66b9c4ec5d7da1a3550b5b58b7)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - better performance by incrementally building
  only packages that had changes

### Patch Changes

- [#129](https://github.com/kamilkisiela/bob/pull/129)
  [`cd16844`](https://github.com/kamilkisiela/bob/commit/cd16844210db99a3e74fa95c3311fb644ad48594)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:

  - Updated dependency
    [`rollup-plugin-typescript2@^0.33.0` ↗︎](https://www.npmjs.com/package/rollup-plugin-typescript2/v/null)
    (from `^0.32.1`, in `dependencies`)

- [#144](https://github.com/kamilkisiela/bob/pull/144)
  [`76fd23c`](https://github.com/kamilkisiela/bob/commit/76fd23c0f0887a8e324a92b0cff705214e1883bc)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - Correct package.json for types-only packages

## 4.0.0

### Major Changes

- f685733: Change the exports map again, to please TypeScript commonjs :)

  This is a major breaking change as it requires adjusting your `package.json` exports map.

  The `require` entries file extension must be changed from `.d.ts` to `.d.cts`.

  ```diff
    {
      "exports": {
        ".": {
          "require": {
  -          "types": "./dist/typings/index.d.ts",
  +          "types": "./dist/typings/index.d.cts"
          }
        }
      }
    }
  ```

### Minor Changes

- 14fa965: Disable commonjs output via package.json

  ```json
  {
    "name": "my-package",
    "bob": {
      "commonjs": false
    }
  }
  ```

- b8db426: Ignore `__tests__` and `__testUtils__` from bundling

## 3.0.5

### Patch Changes

- 16952de: Use correct path for checking file existence in exports map.

## 3.0.4

### Patch Changes

- e096322: Replace babel based export/import source location transform with an improved regex based
  transform that reduces code change noise and preserves the original formatting.

## 3.0.3

### Patch Changes

- 0c36290: Support type imports/exports.

## 3.0.2

### Patch Changes

- b6976a9: Use a more reliable import/export transform for the bootstrap command

## 3.0.1

### Patch Changes

- 086c1a8: Run typescript tsc commands in sequence instead of in parallel to avoid race conditions
  where the `.bob/cjs` or `.bob/esm` folder is missing.

## 3.0.0

### Major Changes

- 0f3f9ac: Remove the `flat-pack`, `validate` and `run` commands that are no longer maintained and
  used.
- 1605028: Remove the global config. Please add `bob: false` to the individual `package.json`
  workspaces that should not be processed by bob.

  This is the new config format for bob.

  ```ts
  type BobConfig =
    /** completely disable bob for this package. */
    | false
    | {
        /** Whether the package should be built. */
        build?:
          | false
          | {
              /** Files to copy from the package root to dist */
              copy?: Array<string>;
            };
        /** Whether the package should be checked. */
        check?:
          | false
          | {
              /** Exports within the package that should not be checked. */
              skip?: Array<string>;
            };
      };
  ```

## 2.0.0

### Major Changes

- ae0b4b2: Require specifying typescript fields in the package.json exports map for typescript
  modules support. Learn more on the
  [TypeScript 4.7 release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#package-json-exports-imports-and-self-referencing).

### Minor Changes

- 0942e1c: unpin and update dependencies
- 59ead17: remove the `--single` flag. The value is now derived from the `package.json` `workspaces`
  property. If your workspace is configured properly this is not a breaking change.

## v1.7.3

- Run `next start` directly from nextjs's lib, not CLI code.

## v1.7.2

- Do not add `require` automatically (breaking but we use it only internally)
- Introduce `banner` to add a banner to the generated files (runify + tsup only)

## v1.7.1

- Adds `require` to ESM output (runify with tsup enabled)

## v1.7.0

- Detect `"type": "module"` in `runify` command to decide on ESM vs CJS output (works only with TSUP
  enabled).
- Keep the original value of `type` when rewriting `package.json` (runify command)

## v1.6.2

- Make config optional

## v1.6.1

- Do not copy `.next/cache/webpack`

## v1.6.0

- Support tsup in `runify` command
- Introduce `tag` for `runify` command
- Support `--single` run for `runify` command

## 1.4.1 - 1.6.0

- a lot of good things

## v1.4.1

- fix typo `.msj` (should be `.mjs`)

## v1.4.0

- Support multiple dist configurations and ESM [#13](https://github.com/kamilkisiela/bob/pull/13)

## v1.3.0

- added `runify` command to produce stanalone (node_modules included) bundles and to make them
  executable with `node index.js` (supports NextJS)

## 1.2.1

...
