# Catalyst Pluginizr (by The BigRick)

## Table of Contents

- [Introduction](#introduction)
- [BETA](#beta)
- [Installation & Setup](#installation--setup)
- [How It Works](#how-it-works)
    - [Requirements for a Plugin](#requirements-for-a-plugin)
- [Declaring Plugins](#declaring-plugins)
    - [Example: Function Plugin](#example-function-plugin)
    - [Example: Component Plugin](#example-component-plugin)
    - [Naming Conventions](#naming-conventions)
- [Additional Notes](#additional-notes)
- [Contributing](#contributing)
- [License](#license)

## Introduction

**@thebigrick/catalyst-pluginizr** is a drop-in pluginization system designed specifically
for [Catalyst (BigCommerce)](https://www.catalyst.dev/). It provides a flexible and extensible framework to
enhance, override, or augment functionality at multiple integration points within a Catalyst-based application.

With this tool, you can:

- **Extend UI Components:** Easily wrap existing React components — both on the server and client side — without
  directly
  modifying their source code. Add extra markup, style, or logic around established components.
- **Enrich Server Actions:** Intercept server actions and other functions to alter their behavior, input, or output.
  This could mean adding logging, modifying parameters, or overriding return values.
- **Integrate Third-Party Logic:** Inject external business rules, analytics, or A/B testing logic into any function or
  component, improving maintainability and reducing code duplication.

By adopting **@thebigrick/catalyst-pluginizr**, you streamline the development process, keeping your core code clean and
stable while introducing changes via isolated, version-controlled plugins. As a result, developers can maintain a
modular architecture that’s easier to test, debug, and evolve over time.

## BETA

This package must be still considered as a beta. While it is stable and functional, it may still undergo changes before
the final and some features may not be fully implemented.

## Installation & Setup

1. **Add the package**:  
   Install the `@thebigrick/catalyst-pluginizr` package inside your `packages` directory:

   ```bash
   cd path-to-catalyst/packages
   git clone https://github.com/thebigrick/catalyst-pluginizr.git
   ```
2. **Enable `plugins/*` in the pnpm workspace**:  
   In your `pnpm-workspace.yaml`, add the `plugins/*` pattern so that it recognizes your plugin workspace:

   ```yaml
   packages:
     - core
     - packages/*
     - plugins/*
   ```
3. Configure Next.js with Catalyst Pluginizr:
   In your `core/next.config.ts`, import and apply `withCatalystPluginizr` to your Next.js configuration just after the
   `withNextIntl` call:
   ```ts
   ...
   import { withCatalystPluginizr } from '@thebigrick/catalyst-pluginizr';
   ...
   nextConfig = withNextIntl(nextConfig); // Search for this line
   nextConfig = withCatalystPluginizr(nextConfig); // Add this line
   ...
   ```

## How It Works

Once the configuration is in place, you can develop your plugins by placing them inside the `plugins` directory. For
example:

```
plugins/
  my-plugin/
    src/
      register-plugins.ts
      plugins/
        test.tsx
    tsconfig.json
    package.json
```

### Requirements for a Plugin

- TypeScript project: Each plugin must be a TypeScript project with a valid `tsconfig.json`.
- `register-plugins.ts` file: Inside the plugin’s src folder, create a file named `register-plugins.ts`. This file
  should
  import and call `registerFnPlugin` and/or `registerFcPlugin` to declare plugins.

## Declaring Plugins

You have two types of plugins:

1. **Function Plugins** (`registerFnPlugin`):
   Useful for wrapping or modifying server actions and other arbitrary functions.

2. **Component Plugins** (`registerFcPlugin`):
   Ideal for wrapping React components. This lets you modify UI components without altering their source code directly.

### Example: Function Plugin

Below is an example of how to wrap a server function. The wrap method receives the original function `fn` and its
arguments, allowing you to modify them before calling `fn`.

```ts
import { registerFnPlugin } from "@thebigrick/catalyst-pluginizr/src/registry";
import { getSearchResults } from "@bigcommerce/catalyst-core/components/header/_actions/get-search-results";

registerFnPlugin<typeof getSearchResults>({
  name: "convert-search-term",
  functionId: "@bigcommerce/catalyst-core/components/header/_actions/get-search-results:getSearchResults",
  wrap: (fn, searchTerm) => {
    if (searchTerm === "test") {
      return fn("Product Test");
    }

    return fn(searchTerm);
  },
});
```

### Example: Component Plugin

For component plugins, it is recommended to separate the plugin component definition from the `register-plugins.ts`.
First, define your plugin in a separate .tsx file, for example `plugins/my-header.tsx`:

```tsx
import { PluginFC } from "@thebigrick/catalyst-pluginizr";
import React from "react";
import { Header } from "@bigcommerce/catalyst-core/components/header";

const myHeaderPlugin: PluginFC<typeof Header> = {
  name: "my-header",
  component: "@bigcommerce/catalyst-core/components/header:Header",
  wrap: ({ WrappedComponent, ...props }) => {
    return (
      <div className={"my-wrapper"}>
        <div className={"offer"}>Get 50% off on your next buy</div>
        <WrappedComponent {...props} />
      </div>
    );
  },
};

export default myHeaderPlugin;
```

Then, import and register the plugin in `register-plugins.ts`:

```ts
import { registerFcPlugin } from "@thebigrick/catalyst-pluginizr";
import myHeaderPlugin from "./plugins/my-header";

registerFcPlugin(myHeaderPlugin);
```

### Naming Conventions

- `name`: Provide a descriptive name for each plugin.
- `functionId` or `component`: Must match the original function or component you want to wrap.
  Use the `packageName/path/to/item:itemName` format (e.g., `@bigcommerce/catalyst-core/components/header:Header`)
    - `itemName`: is the export name (omit if default export).
    - `packageName` is the Package name from `package.json` (e.g., `@bigcommerce/catalyst-core`).
    - `path/to/item` is the path to the item from the package source code root (e.g., `components/header`).

## Additional Notes

- You can register multiple plugins inside register-plugins.ts.
- Plugins are applied in the order they are registered.
- Changes made by plugins are automatically applied to your Catalyst project.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request on
GitHub.

## License

This project is licensed under the MIT License. See the `LICENSE.md` file for details.
