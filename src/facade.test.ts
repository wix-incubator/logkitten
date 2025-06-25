import {
  AndroidEntry,
  Entry,
  Filter,
  IosEntry,
  logkitten,
  Level,
} from './index';

// eslint-disable-next-line jest/no-disabled-tests
it.skip('README examples type check', () => {
  // Android options
  const androidEmitter = logkitten({
    platform: 'android',
    adbPath: '/custom/path/to/adb',
    deviceId: 'emulator-5554',
    filter: (entry) => entry.tag === 'MyApp',
  });

  androidEmitter.on('entry', (entry) => {
    console.log(entry.uid);
  });

  // iOS options
  const iosEmitter = logkitten({
    platform: 'ios',
    deviceId: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
    filter: (entry) => entry.processImagePath.includes('/MyApp'),
  });

  iosEmitter.on('entry', (entry) => {
    console.log(entry.processImagePath);
  });

  expect(Level.TRACE).toBe(10);
  expect(Level.DEBUG).toBe(20);
  expect(Level.INFO).toBe(30);
  expect(Level.WARN).toBe(40);
  expect(Level.ERROR).toBe(50);
  expect(Level.FATAL).toBe(60);

  const filters: Record<string, Filter<IosEntry & AndroidEntry>> = {
    byPid: (entry: Entry) => entry.pid === 1234,
    byTid: (entry: Entry) => entry.tid === 1234,
    byMessage: (entry: Entry) => /error|warning/i.test(entry.msg),
    bySubsystem: (entry: IosEntry) => entry.subsystem === 'com.facebook.react',
    byTag: (entry: AndroidEntry) => entry.tag === 'MyApp',
    byUser: (entry: AndroidEntry) => entry.uid === 'MyApp',
    byProcessImagePath: (entry: IosEntry) =>
      entry.processImagePath.includes('/example.app/'),
    byMultiCriteria: (entry: Entry) => {
      const isMyApp =
        (entry as AndroidEntry).tag === 'MyApp' ||
        (entry as IosEntry).processImagePath.includes('MyApp');
      const isError = entry.level >= Level.ERROR;
      const hasKeyword = entry.msg.includes('network');
      return !!isMyApp && (isError || hasKeyword);
    },
  };

  expect(filters).toBeDefined();
});
