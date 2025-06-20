export class CodeError extends Error {
  code: string;

  constructor(code: string, message?: string) {
    super(message);
    this.code = code;
  }
}

export const ERR_ANDROID_CANNOT_CLEAN_LOGCAT_BUFFER =
  'ERR_ANDROID_CANNOT_CLEAN_LOGCAT_BUFFER';
export const ERR_ANDROID_CANNOT_START_LOGCAT =
  'ERR_ANDROID_CANNOT_START_LOGCAT';

export const ERR_IOS_CANNOT_LIST_SIMULATORS = 'ERR_IOS_CANNOT_LIST_SIMULATORS';
export const ERR_IOS_NO_SIMULATORS_BOOTED = 'ERR_IOS_NO_SIMULATORS_BOOTED';
export const ERR_IOS_CANNOT_START_SYSLOG = 'ERR_IOS_CANNOT_START_SYSLOG';
