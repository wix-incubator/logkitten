## [1.3.2](https://github.com/wix-incubator/logkitten/compare/v1.3.1...v1.3.2) (2025-09-25)


### Bug Fixes

* **ios:** ignore all getpwuid_r errors ([ae83edb](https://github.com/wix-incubator/logkitten/commit/ae83edb31f688ca4801c589af4e85cbb01569a56))

## [1.3.1](https://github.com/wix-incubator/logkitten/compare/v1.3.0...v1.3.1) (2025-09-24)


### Bug Fixes

* more robust close strategy ([#7](https://github.com/wix-incubator/logkitten/issues/7)) ([04a8059](https://github.com/wix-incubator/logkitten/commit/04a80599757dbb549879b495445b28d297b4ebbe))

# [1.3.0](https://github.com/wix-incubator/logkitten/compare/v1.2.0...v1.3.0) (2025-06-25)


### Features

* new parsing system ([cac1a07](https://github.com/wix-incubator/logkitten/commit/cac1a0762b7d005c6c90ab03ff4a6beaadbaca0b))

# [1.2.0](https://github.com/wix-incubator/logkitten/compare/v1.1.1...v1.2.0) (2025-06-24)


### Features

* add .close() API ([48b64bd](https://github.com/wix-incubator/logkitten/commit/48b64bde619ab131ca6dce9a39819af915b08d15))

## [1.1.1](https://github.com/wix-incubator/logkitten/compare/v1.1.0...v1.1.1) (2025-06-20)


### Bug Fixes

* type names ([00e25cc](https://github.com/wix-incubator/logkitten/commit/00e25cc6cacc4cc076afce65c152ee9d0c9e97c7))

# [1.1.0](https://github.com/wix-incubator/logkitten/compare/v1.0.2...v1.1.0) (2025-06-20)


### Features

* add support for specific device selection ([652fa24](https://github.com/wix-incubator/logkitten/commit/652fa24c0af8a7fa46433e1382d53e8fe4f90048))

## [1.0.2](https://github.com/wix-incubator/logkitten/compare/v1.0.1...v1.0.2) (2025-06-20)


### Bug Fixes

* remove redundant scope ([5d05a6a](https://github.com/wix-incubator/logkitten/commit/5d05a6a8e9df4d9de4556d842138fc8a25d5f20e))

## [1.0.1](https://github.com/wix-incubator/logkitten/compare/v1.0.0...v1.0.1) (2025-06-20)


### Bug Fixes

* repository name ([eb5c127](https://github.com/wix-incubator/logkitten/commit/eb5c1275bc2601de3e1433693a8d31323b19c529))

# 1.0.0 (2025-06-20)


### Bug Fixes

* adb path detection on windows ([#3](https://github.com/wix-incubator/logkitten/issues/3)) ([ed34fd5](https://github.com/wix-incubator/logkitten/commit/ed34fd5e5803e5a9c9e3255d3c0558a02f2f1466))
* adb typo ([#2](https://github.com/wix-incubator/logkitten/issues/2)) ([2af69f9](https://github.com/wix-incubator/logkitten/commit/2af69f9f99fbc176859992eaba03e31c80a34951))
* add missing stderr to mocked child process ([7c7660e](https://github.com/wix-incubator/logkitten/commit/7c7660edc783eb350f1e9991d5e7f8c19dfe6e26))
* filter condition for custom patters ([acf01dc](https://github.com/wix-incubator/logkitten/commit/acf01dcac2bc386491dde09a85d66faa3db44719))
* incorrect date when parsing Android entry ([34a442a](https://github.com/wix-incubator/logkitten/commit/34a442a61fdd36b51127506f79e3cbb4f9dc80c4))
* remove default priority ([2046703](https://github.com/wix-incubator/logkitten/commit/204670300e3cf9e284d650388772c1d6edf2a550))
* use correct iOS priority in formatEntry ([8f99c8f](https://github.com/wix-incubator/logkitten/commit/8f99c8f65bde024e56f692410376496e13381b98))
* windows ([#8](https://github.com/wix-incubator/logkitten/issues/8)) ([36522cb](https://github.com/wix-incubator/logkitten/commit/36522cb4528befbfc4d12aa41efdca8f37009b77))


### Features

* add support for iOS simulators to API ([532850d](https://github.com/wix-incubator/logkitten/commit/532850d84f3a30606d94b9211fa584fb6100179d))
* log error when no ios simulators are booted ([29f1b4c](https://github.com/wix-incubator/logkitten/commit/29f1b4c929efac48910742d3da8f5f1b4ec2fd5c))
* support ANDROID_SDK_ROOT ([b02afc5](https://github.com/wix-incubator/logkitten/commit/b02afc5f16c7d0b58585467e73945cb5b30ab8eb))
