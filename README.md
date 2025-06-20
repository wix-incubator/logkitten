# logkitten

[![Version][version]][package]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]
[![MIT License][license-badge]][license]

Stream Android and iOS logs without Android Studio or Console.app, with programmatic Node.js API for log analysis.

> This is a Wix fork of the original [logkitten](https://github.com/zamotany/logkitten) project.

## Installation

```sh
npm install logkitten
# or
yarn add logkitten
```

## Usage

```ts
import {
  logkitten,
  AndroidPriority,
  IosPriority,
  Entry,
} from 'logkitten';

// Basic usage - get all Android logs
const emitter = logkitten({
  platform: 'android',
  priority: AndroidPriority.DEBUG,
});

emitter.on('entry', (entry: Entry) => {
  // Process the structured log entry
  console.log({
    timestamp: entry.date.format(),
    priority: entry.priority,
    tag: entry.tag,
    message: entry.messages.join('\n'),
    platform: entry.platform
  });
});

emitter.on('error', (error: Error) => {
  console.error('Logging error:', error.message);
});
```

## API Reference

### `logkitten(options: LogkittyOptions): EventEmitter`

Spawns logkitten with given options:

* `platform: 'android' | 'ios'` - Platform to get the logs from: uses `adb logcat` for Android and `xcrun simctl` + `log` for iOS simulator.
* `adbPath?: string` - Custom path to adb tool or `undefined` (used only when `platform` is `android`).
* `priority?: number` - Minimum priority of entries to show of `undefined`, which will include all entries with priority **DEBUG** (Android)/**DEFAULT** (iOS) or above.
* `filter?: (entry: Entry) => boolean` - Optional filter function that receives each log entry and returns true to include it or false to exclude it.

When spawning logkitten you will get a instance of `EventEmitter` which emits the following events:

* `entry` (arguments: `entry: Entry`) - Emitted when new log comes in, that matches the `filter` and `priority` options. Process the structured entry object for your analysis needs.
* `error` (arguments: `error: Error`) - Emitted when the log can't be parsed into a entry or when the Logcat process emits an error.

### Entry Structure

Each log entry is a structured object:

```ts
interface Entry {
  date: Dayjs;           // Parsed timestamp
  pid: number;           // Process ID
  priority: number;      // Log priority/level
  tag: string;           // Log tag
  appId?: string;        // App identifier (Android)
  messages: string[];    // Log message lines
  platform: 'android' | 'ios';
}
```

## Filtering

You can provide a custom filter function to control which log entries are emitted:

```ts
const emitter = logkitten({
  platform: 'android',
  priority: AndroidPriority.INFO,
  filter: (entry) => {
    // Only include entries with specific tags
    return entry.tag === 'MyApp' || entry.tag === 'ReactNative';
  }
});
```

### Filter Examples

**Filter by tag:**
```ts
filter: (entry) => entry.tag === 'MyApp'
```

**Filter by app (Android only):**
```ts
filter: (entry) => entry.pid === myAppPid
```

**Filter by message content:**
```ts
filter: (entry) => entry.messages.some(msg => /error|warning/i.test(msg))
```

**Complex filtering:**
```ts
filter: (entry) => {
  const isMyApp = entry.tag === 'MyApp';
  const isError = entry.priority >= AndroidPriority.ERROR;
  const hasKeyword = entry.messages.some(msg => msg.includes('network'));
  return isMyApp && (isError || hasKeyword);
}
```

## Priority Levels

### Android Priorities

```ts
import { AndroidPriority } from 'logkitten';

// Available priorities (from lowest to highest):
AndroidPriority.UNKNOWN  // Unknown priority
AndroidPriority.VERBOSE  // Verbose priority
AndroidPriority.DEBUG    // Debug priority (default)
AndroidPriority.INFO     // Info priority
AndroidPriority.WARN     // Warn priority
AndroidPriority.ERROR    // Error priority
AndroidPriority.FATAL    // Fatal priority
AndroidPriority.SILENT   // Silent priority
```

### iOS Priorities

```ts
import { IosPriority } from 'logkitten';

// Available priorities:
IosPriority.DEFAULT  // Default level
IosPriority.DEBUG    // Debug level
IosPriority.INFO     // Info level
IosPriority.ERROR    // Error level
```

## Examples

### Log Analysis

```ts
import { logkitten, AndroidPriority } from 'logkitten';

const emitter = logkitten({
  platform: 'android',
  priority: AndroidPriority.INFO,
});

const errorCount = new Map();

emitter.on('entry', (entry) => {
  if (entry.priority >= AndroidPriority.ERROR) {
    const count = errorCount.get(entry.tag) || 0;
    errorCount.set(entry.tag, count + 1);
  }
});

// Log error summary every 10 seconds
setInterval(() => {
  console.log('Error counts by tag:', Object.fromEntries(errorCount));
}, 10000);
```

### Filtering and Processing

```ts
import { logkitten, IosPriority } from 'logkitten';

const emitter = logkitten({
  platform: 'ios',
  priority: IosPriority.DEBUG,
  filter: (entry) => entry.tag === 'MyApp',
});

const logs = [];

emitter.on('entry', (entry) => {
  // Store structured log data
  logs.push({
    timestamp: entry.date.unix(),
    level: entry.priority,
    source: entry.tag,
    content: entry.messages.join(' '),
  });

  // Keep only last 1000 entries
  if (logs.length > 1000) {
    logs.shift();
  }
});
```

### Custom ADB path (Android)

```ts
import { logkitten, AndroidPriority } from 'logkitten';

const emitter = logkitten({
  platform: 'android',
  adbPath: '/custom/path/to/adb',
  priority: AndroidPriority.DEBUG,
});
```

### Advanced Filtering

```ts
import { logkitten, AndroidPriority } from 'logkitten';

const emitter = logkitten({
  platform: 'android',
  priority: AndroidPriority.VERBOSE,
  filter: (entry) => {
    // Multi-criteria filtering
    const isReactNative = entry.tag?.includes('ReactNative');
    const isMyApp = entry.tag === 'MyApp';
    const hasError = entry.messages.some(msg => /error|exception/i.test(msg));
    const isHighPriority = entry.priority >= AndroidPriority.WARN;

    // Include if it's from my app components OR if it's a high priority message with errors
    return (isReactNative || isMyApp) || (isHighPriority && hasError);
  }
});
```

## Credits

This project is a fork and continuation of the original [logkitten](https://github.com/zamotany/logkitten) by [Paweł Trysła (@zamotany)](https://github.com/zamotany), maintained by Wix.

The original project has been inactive since 2020, and this fork continues development with modern dependencies and bug fixes.
While we maintain this fork primarily for our own use, we welcome community contributions and will consider issues and feature requests as time permits.

<!-- badges (common) -->

[license-badge]: https://img.shields.io/npm/l/logkitten.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
[version]: https://img.shields.io/npm/v/logkitten.svg?style=flat-square
[package]: https://www.npmjs.com/package/logkitten
