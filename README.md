# logkitten

[![Version][version]][package]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]
[![MIT License][license-badge]][license]

Stream Android and iOS logs without Android Studio or Console.app, with programmatic Node.js API for log analysis.

> This is a Wix Incubator fork of the original [logkitty](https://github.com/zamotany/logkitty) project.

## Installation

```sh
npm install logkitten
# or
yarn add logkitten
```

## Usage

```ts
import { logkitten, Level } from 'logkitten';

// Basic usage - get all Android logs
const emitter = logkitten({
  platform: 'android',
});

emitter.on('entry', (entry) => {
  // Process the structured log entry
  console.log({
    ts: new Date(entry.ts),
    level: entry.level,
    pid: entry.pid,
    tid: entry.tid,
    message: entry.msg,
  });
});

emitter.on('error', (error: Error) => {
  console.error('Logging error:', error.message);
});

// When you're done listening to logs, close the stream programmatically
await emitter.close(); // or emitter.close(callback)
```

## API Reference

### Main Function

#### `logkitten(options)`

The main function that accepts platform-specific options:

```ts
// Android
const androidEmitter = logkitten({
  platform: 'android',
  // Optional: specify custom adb path
  adbPath: '/custom/path/to/adb',
  // Optional: target specific device
  deviceId: 'emulator-5554',
  // Optional: filter entries
  filter: (entry) => entry.tag === 'MyApp'
});

// iOS
const iosEmitter = logkitten({
  platform: 'ios',
  // Optional: target specific simulator (defaults to 'booted')
  deviceId: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
  // Optional: filter entries
  filter: (entry) => entry.processImagePath.includes('/MyApp')
});
```

### Entry Structure

Each log entry is a structured object with platform-specific extensions:

```ts
interface Entry {
  msg: string;           // Message content
  ts: number;           // Timestamp in milliseconds
  pid: number;          // Process ID
  tid: number;          // Thread ID
  level: number;        // Log level/priority (Level enum)
}

interface AndroidEntry extends Entry {
  tag: string;          // Log tag
  uid: string;          // User ID
}

interface IosEntry extends Entry {
  category: string;           // iOS category
  formatString: string;       // Format string used for the log message
  processImagePath: string;   // Path to the process executable
  subsystem: string;          // iOS subsystem
  userID: number;            // User ID
}
```

### LogkittenEmitter

The emitter returned by all functions extends Node's `EventEmitter` and provides:

* **Events**
  * `entry` (arguments: `entry: AndroidEntry | IosEntry`) – Emitted when a new log entry passes filters.
  * `error` (arguments: `error: Error`) – Emitted when parsing fails or the underlying process encounters errors.
  * `close` – Emitted once the logging process is terminated via `.close()`.

* **Methods**
  * `close(cb?)` – Gracefully stops the underlying logging process and returns a Promise that resolves when cleanup is complete.

## Levels

```ts
import { Level } from 'logkitten';

// Available priorities (from lowest to highest):
Level.TRACE    // 10 - Trace level (Android verbose)
Level.DEBUG    // 20 - Debug level
Level.INFO     // 30 - Info level
Level.WARN     // 40 - Warning level
Level.ERROR    // 50 - Error level
Level.FATAL    // 60 - Fatal level
```

## Filtering

You can provide a custom filter function to control which log entries are emitted:

```ts
const emitter = logkitten({
  platform: 'android',
  filter: (entry) => {
    // Only include entries with specific tags
    return entry.tag === 'MyApp' || entry.tag === 'ReactNative';
  }
});
```

### Filter Examples

**Filter by tag (Android):**

```ts
(entry) => entry.tag === 'MyApp'
```

**Filter by process (both platforms):**

```ts
(entry) => entry.pid === myAppPid
```

**Filter by message content:**

```ts
filter: (entry) => /error|warning/i.test(entry.msg)
```

**Filter by subsystem (iOS):**

```ts
filter: (entry) => entry.subsystem === 'com.mycompany.myapp'
```

**Multi-criteria filtering:**

```ts
(entry) => {
  const isMyApp = entry.tag === 'MyApp' || entry.processImagePath?.includes('MyApp');
  const isError = entry.level >= Level.ERROR;
  const hasKeyword = entry.msg.includes('network');
  return isMyApp && (isError || hasKeyword);
}
```

## Examples

### Log Analysis and Error Tracking

```ts
const emitter = logkitten({
  platform: 'android',
});

const errorCount = new Map();

emitter.on('entry', (entry) => {
  if (entry.level >= Level.ERROR) {
    const count = errorCount.get(entry.tag) || 0;
    errorCount.set(entry.tag, count + 1);
  }
});

// Log error summary every 10 seconds
setInterval(() => {
  console.log('Error counts by tag:', Object.fromEntries(errorCount));
}, 10000);
```

### Structured Log Storage

```ts
const emitter = logkitten({
  platform: 'ios',
  filter: (entry) => entry.processImagePath.includes('/MyApp'),
});

const logs = [];

emitter.on('entry', (entry) => {
  // Store structured log data
  logs.push({
    timestamp: entry.ts,
    level: entry.level,
    source: entry.subsystem,
    content: entry.msg,
  });

  // Keep only last 1000 entries
  if (logs.length > 1000) {
    logs.shift();
  }
});
```

## Credits

This project is a fork and continuation of the original [logkitty](https://github.com/zamotany/logkitty) by [Paweł Trysła (@zamotany)](https://github.com/zamotany), maintained by Wix Incubator.

The original project has been inactive since 2020, and this fork continues development with modern dependencies and bug fixes.
While we maintain this fork primarily for our own use, we welcome community contributions and will consider issues and feature requests as time permits.

<!-- badges (common) -->

[license-badge]: https://img.shields.io/npm/l/logkitten.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
[version]: https://img.shields.io/npm/v/logkitten.svg?style=flat-square
[package]: https://www.npmjs.com/package/logkitten
