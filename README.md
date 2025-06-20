# logkitten

[![Version][version]][package]

[![PRs Welcome][prs-welcome-badge]][prs-welcome]
[![MIT License][license-badge]][license]
[![Chat][chat-badge]][chat]
[![Code of Conduct][coc-badge]][coc]

Display __pretty__ Android and iOS logs __without Android Studio or Console.app__,  with __intuitive__ Command Line Interface.

> This is a Wix fork of the original [logkitten](https://github.com/zamotany/logkitten) project.

![Demo](./logkitten.gif)

## Installation

```sh
yarn global add logkitten
```

Or if you prefer having it locally:

```sh
yarn add -D logkitten
yarn logkitten --help
```

## Usage

```sh
logkitten <platform> <command> [options]
```

### Command line help

You can inspect available platforms, command and options for a given platform by adding `-h` at the end, for example:

```sh
logkitten -h # prints available platforms and global options
logkitten android -h # prints commands and options for android
logkitten android tag -h # prints tag command syntax and options for android
```

### Commands

* platform: `android`:
  * `tag <tags...>` - Show logs with matching tags.
  * `app <appId>` - Show logs from application with given identifier.
  * `match <regexes...>` - Show logs matching given patterns (all regexes have flags `g` and `m`).
  * `custom <patterns...>` - Use custom [patters supported by Logcat](https://developer.android.com/studio/command-line/logcat#filteringOutput).
  * `all` - Show all logs.
* platform: `ios`:
  * `tag <tags...>` - Show logs with matching tags (where tag is usually a name of the app).
  * `match <regexes...>` - Show logs matching given patterns (all regexes have flags `g` and `m`).
  * `all` - Show all logs.

### Options

* common:
  * `-h, --help` - Display help
  * `-v, --version` - Display version
* platform `android`:

  `tag`, `app`, `match` and `all` commands support additional priority filtering options (sorted by priority):

  * `-U, -u` - Unknown priority (lowest)
  * `-v, -v` - Verbose priority
  * `-D, -d` - Debug priority (default)
  * `-I, -i` - Info priority
  * `-W, -w` - Warn priority
  * `-E, -e` - Error priority
  * `-F, -f` - Fatal priority
  * `-S, -s` - Silent priority (highest)

  For example `logkitten android all -W` will display all logs with priority __warn__, __error__ and __fatal__.

* platform `ios`:

  `tag`, `match` and `all` commands support additional level filtering options:

  * `-D, -d` - Debug level
  * `-I, -i` - Info level
  * `-E, -e` - Error level

### Examples

Show all logs with tag `ReactNativeJS` (and default priority - __debug and above__):

```sh
logkitten android tag ReactNativeJS
logkitten ios tag ReactNativeJS
```

Show all logs with priority __info and above__ from application with identifier `com.example.myApplication`:

```sh
logkitten android app com.example.myApplication -i
```

Show all logs matching `/CodePush/gm` regex:

```sh
logkitten android match CodePush
logkitten ios match CodePush
```

Show all logs with priority __error__ or __fatal__ for Android and __error_ level for iOS:

```sh
logkitten android all -e
logkitten ios all -e
```

Show logs using custom patterns - silence all logs and display only the onces with tag `my-tag` and priority __debug and above__:

```sh
logkitten android custom *:S my-tag:D
```

### Node API

If your building a tool and want to use Node API, head over to [Node API documentation](./docs/NODE_API.md).

## Credits

This project is a fork and continuation of the original [logkitten](https://github.com/zamotany/logkitten) by [Paweł Trysła (@zamotany)](https://github.com/zamotany), maintained by Wix.

The original project has been inactive since 2020, and this fork continues development with modern dependencies and bug fixes.
While we maintain this fork primarily for our own use, we welcome community contributions and will consider issues and feature requests as time permits.

<!-- badges (common) -->

[license-badge]: https://img.shields.io/npm/l/logkitten.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/wix-incubator/logkitten/blob/master/CODE_OF_CONDUCT.md
[chat-badge]: https://img.shields.io/badge/chat-discord-brightgreen.svg?style=flat-square&colorB=7289DA&logo=discord
[chat]: https://discord.gg/zwR2Cdh

[version]: https://img.shields.io/npm/v/logkitten.svg?style=flat-square
[package]: https://www.npmjs.com/package/logkitten
