# useUrlParams

[![npm version](https://img.shields.io/npm/v/use-url-params?color=blue)](https://www.npmjs.com/package/use-url-params)
[![npm downloads](https://img.shields.io/npm/dw/use-url-params)](https://www.npmjs.com/package/use-url-params)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](../../LICENSE)

A lightweight React hook library for managing **URL query parameters** with full TypeScript support and auto-generated helper methods.

Built for [`react-router-dom`](https://reactrouter.com/) (v6+) with **type-safe keys**, **option validation**, and **handy helper flags**.

The library provides two hooks:
- **`useUrlParams`** - Manage a single query parameter
- **`useBatchUrlParams`** - Manage multiple query parameters at once

---

## ✨ Features

- 🔒 **Type-safe** query parameter keys and values
- ⚡ **Auto-generated helpers**: `set<Key>`, `toggle<Key>`, `is<Key><Option>`, `clear<Key>`
- 🔄 **Toggle mode** for 2-option parameters
- ✅ Works seamlessly with `react-router-dom`’s `useSearchParams`
- 🪶 Zero dependencies (except React & react-router-dom)

---

## 📦 Installation

```bash
npm install react-url-query-params
```
or
```bash
yarn add react-url-query-params
```
## 🚀 Usage

![Demo of react-url-query-params](./docs/demo.gif)

### Single Parameter: `useUrlParams`

```tsx
import { useUrlParams } from 'react-url-query-params';

export default function MyComponent() {
  const { view, setView, toggleView, isViewGrid, isViewTable } = useUrlParams({
    keyName: 'view',
    options: ['grid', 'table'],
  });

  return (
    <div>
      <p>Current view: {view}</p>
      <button onClick={() => setView('grid')}>Grid</button>
      <button onClick={() => setView('table')}>Table</button>
      <button onClick={() => toggleView()}>Toggle</button>

      {isViewGrid && <div>Grid mode enabled</div>}
      {isViewTable && <div>Table mode enabled</div>}
    </div>
  );
}
``` 

### Multiple Parameters: `useBatchUrlParams`

```tsx
import { useBatchUrlParams } from 'react-url-query-params';

export default function MyComponent() {
  const { set, isViewGrid, isViewTable, isModalOpened, isModalClosed } = useBatchUrlParams({
    view: ['grid', 'table'],
    modal: ['opened', 'closed'],
  });

  return (
    <div>
      <button onClick={() => set({ view: 'grid', modal: 'opened' })}>
        Open Grid View
      </button>
      <button onClick={() => set({ view: 'table' })}>
        Switch to Table
      </button>

      {isViewGrid && <div>Grid mode enabled</div>}
      {isViewTable && <div>Table mode enabled</div>}
      {isModalOpened && <div>Modal is open</div>}
      {isModalClosed && <div>Modal is closed</div>}
    </div>
  );
}
```

---

## 📚 API Reference

### `useUrlParams(config)`

Manage a single query parameter with type-safe helpers.

**Config:**

| Option       | Type                              | Description |
|--------------|-----------------------------------|-------------|
| `keyName`    | `string`                          | Query parameter key |
| `options`    | `readonly string[]`               | Allowed values for this param |

**Returns:**
- `[keyName]` — current value (`string` or `null`)
- `set<Key>` — function to set a value
- `toggle<Key>` — toggle between 2 allowed values (only works if `options.length === 2`)
- `clear<Key>` — function to clear parameter from url
- `is<Key><Option>` — boolean helper for quick checks

**Example:**
```tsx
const { view, setView, toggleView, isViewGrid, isViewTable } = useUrlParams({
  keyName: 'view',
  options: ['grid', 'table'],
});
```

---

### `useBatchUrlParams(config)`

Manage multiple query parameters simultaneously with a single hook.

**Config:**

A record object where:
- **Keys** are the query parameter names (e.g., `'view'`, `'modal'`)
- **Values** are readonly arrays of allowed values (e.g., `['grid', 'table']`)


**Returns:**

- **`set`** — function to update one or more parameters at once
  - Accepts a partial object of key-value pairs
  - Only updates the specified parameters, leaving others unchanged
- **`is<Key><Option>`** — boolean flags for each key-option combination
  - Automatically generated based on your config
  - Format: `is${Capitalize<Key>}${Capitalize<Option>}`
  - Example: For `view: ['grid', 'table']`, you get `isViewGrid` and `isViewTable`

**Examples:**

```tsx
// Basic usage
const { set, isViewGrid, isViewTable } = useBatchUrlParams({
  view: ['grid', 'table'],
});

// Multiple parameters
const { set, isViewGrid, isViewTable, isModalOpened, isModalClosed } = useBatchUrlParams({
  view: ['grid', 'table'],
  modal: ['opened', 'closed'],
});

// Update single parameter
set({ view: 'grid' });

// Update multiple parameters at once
set({ view: 'table', modal: 'opened' });

// Use boolean flags
if (isViewGrid && isModalOpened) {
  // Both conditions are true
}
```

**Advanced Example:**

```tsx
import { useBatchUrlParams } from 'react-url-query-params';

function FilterableTable() {
  const { set, isSortAsc, isSortDesc, isFilterActive, isFilterInactive } = useBatchUrlParams({
    sort: ['asc', 'desc'],
    filter: ['active', 'inactive'],
  });

  return (
    <div>
      <button onClick={() => set({ sort: 'asc' })}>
        Sort Ascending {isSortAsc && '✓'}
      </button>
      <button onClick={() => set({ sort: 'desc' })}>
        Sort Descending {isSortDesc && '✓'}
      </button>
      <button onClick={() => set({ filter: 'active' })}>
        Show Active {isFilterActive && '✓'}
      </button>
      <button onClick={() => set({ filter: 'inactive' })}>
        Show Inactive {isFilterInactive && '✓'}
      </button>
      
      {/* Update both at once */}
      <button onClick={() => set({ sort: 'desc', filter: 'active' })}>
        Reset Filters
      </button>
    </div>
  );
}
```

**Notes:**
- Use `as const` for the options arrays to get the best TypeScript inference
- The `set` function uses `replace: false`, so it adds to browser history
- Boolean flags are automatically generated and update reactively when URL changes
- All parameter names and values are type-safe based on your config

---
