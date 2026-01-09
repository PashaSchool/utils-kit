# react-csv-autopilot

[![npm version](https://img.shields.io/npm/v/react-csv-autopilot?color=blue&logo=npm)](https://www.npmjs.com/package/react-csv-autopilot)
[![npm downloads](https://img.shields.io/npm/dw/react-csv-autopilot?logo=npm)](https://www.npmjs.com/package/react-csv-autopilot)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-csv-autopilot?color=green&logo=webpack)](https://bundlephobia.com/package/react-csv-autopilot)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Drop the function, we handle the rest.**

A React library for exporting large datasets to CSV with automatic pagination, streaming, and progress tracking. Built with Web Workers for non-blocking performance and File System Access API for efficient file writing.

---

## Features

- **Automatic Pagination** - Just provide a `getNextPage` function, we handle the rest
- **Streaming Export** - Uses ReadableStream for memory-efficient large file exports
- **Non-blocking** - Web Workers for CSV conversion without freezing the UI
- **Progress Tracking** - Real-time progress updates via BroadcastChannel
- **TypeScript** - Full type safety with TypeScript definitions
- **Zero Dependencies** - Only React as peer dependency
- **Framework Agnostic Core** - Use the core logic in any JavaScript environment

---

## Installation

```bash
npm install react-csv-autopilot
```

```bash
yarn add react-csv-autopilot
```

```bash
pnpm add react-csv-autopilot
```

---

## Quick Start

```typescript
import { useExportCSV, useMessageExportCSV } from 'react-csv-autopilot';

function ExportButton() {
  const { handler } = useExportCSV();

  // Track export progress
  useMessageExportCSV((progress) => {
    if (progress.type === 'progress') {
      console.log(`${progress.loadedItemsCount}/${progress.total}`);
    }
  });

  const handleExport = async () => {
    await handler.execute({
      fileName: 'users-export',
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Full Name' },
        { key: 'email', label: 'Email Address' },
      ],
      getNextPage: async (offset) => {
        // Fetch your data - this will be called automatically
        const response = await fetch(`/api/users?page=${offset}&limit=100`);
        const data = await response.json();
        
        return {
          rows: data.users,
          total: data.totalCount,
        };
      },
    });
  };

  return <button onClick={handleExport}>Export to CSV</button>;
}
```

---

## 📖 API Reference

### `useExportCSV()`

Hook that provides access to the CSV export controller.

**Returns:**
```typescript
{
  handler: ExportController // Controller instance for executing exports
}
```

**Example:**
```typescript
const { handler } = useExportCSV();

await handler.execute({
  fileName: 'data-export',
  columns: [...],
  getNextPage: async (offset) => {...}
});
```

---

### `useMessageExportCSV(callback, channelName?)`

Hook for tracking export progress in real-time.

**Parameters:**
- `callback: (payload: ExportProgressPayload) => void` - Called on each progress update
- `channelName?: string` - Optional custom channel name (default: `'EXPORT_CSV_CHANNEL'`)

**Payload Type:**
```typescript
type ExportProgressPayload = {
  total: number;
  loadedItemsCount: number;
  type: 'progress' | 'done' | 'failed';
};
```

**Example:**
```typescript
const [progress, setProgress] = useState({ loaded: 0, total: 0 });

useMessageExportCSV((payload) => {
  setProgress({
    loaded: payload.loadedItemsCount,
    total: payload.total,
  });

  if (payload.type === 'done') {
    console.log('Export completed!');
  }
});
```

---

### Types

#### `ExportParams`

```typescript
type ExportParams = {
  fileName: string;
  columns: Column[];
  getNextPage: (offset: number) => Promise<{ rows: any[]; total: number }>;
};
```

#### `Column`

```typescript
type Column = {
  key: string;
  label: string;
  timezone?: 'UTC' | string;
  formatType?: 'dateFull' | 'dateMediumTime' | 'timeShort' | 'numDecimal' | 'numCompact' | 'numCurrency' | 'numPercent';
};
```


### Pagination Strategies

**API with page numbers:**
```typescript
getNextPage: async (offset) => {
  const page = offset + 1; // Convert to 1-based pagination
  const response = await fetch(`/api/data?page=${page}&size=100`);
  return await response.json();
}
```

**API with cursor-based pagination:**
```typescript
let nextCursor = null;

getNextPage: async (offset) => {
  const url = offset === 0 
    ? '/api/data?limit=100'
    : `/api/data?cursor=${nextCursor}&limit=100`;
    
  const response = await fetch(url);
  const data = await response.json();
  
  nextCursor = data.nextCursor;
  
  return {
    rows: data.items,
    total: data.totalCount,
  };
}
```

---

## Architecture

### How It Works

1. **Stream-based Export** - Uses `ReadableStream` and File System Access API for efficient file writing
2. **Web Workers** - CSV conversion happens in a separate thread to keep UI responsive
3. **Automatic Pagination** - Calls your `getNextPage` function repeatedly until all data is fetched
4. **Progress Tracking** - Uses `BroadcastChannel` to communicate progress across components

```
┌─────────────────┐
│   React Hook    │
│  useExportCSV() │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│ Export          │─────▶│ Web Worker   │
│ Controller      │      │ (CSV Convert)│
└────────┬────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│ ReadableStream  │─────▶│ File System  │
│ (Pagination)    │      │ Access API   │
└─────────────────┘      └──────────────┘
```

---

## Browser Compatibility

Requires browsers with support for:
- **File System Access API** (Chrome 86+, Edge 86+)
- **Web Workers** (All modern browsers)
- **ReadableStream** (All modern browsers)

> **Note:** For browsers without File System Access API, the library will fall back to Blob-based download.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT © [Pavlo Kuzina](../../LICENSE)

---

## 🔗 Links

- **npm Package**: [react-csv-autopilot](https://www.npmjs.com/package/react-csv-autopilot)
- **Repository**: [GitHub - utils-kit](https://github.com/PashaSchool/utils-kit)
- **Issues**: [GitHub Issues](https://github.com/PashaSchool/utils-kit/issues)
- **Monorepo**: Part of [utils-kit](../../README.md) collection

---

## Related Packages

- [**react-url-query-params**](../react-url-query-params) - Type-safe URL query parameter management

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/PashaSchool">Pavlo Kuzina</a></sub>
</div>

