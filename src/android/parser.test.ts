import { Chunker } from '../__tests__/Chunker';
import type { AndroidEntry } from './types';
import { AndroidParser } from './parser';

const DUMP = `
--------- beginning of main
                  0.785  1000  1321  1321 I SELinux : SELinux: Loaded service_contexts from:
--------- beginning of events
                  0.785  1000  1321  1321 I auditd  : SELinux: Loaded service_contexts from:
--------- beginning of radio
         1750850005.865160  1000   125   125 D snet_event_log: [subtag=121035042,-1,]
         1750850005.871666  lmkd   124   124 I lowmemorykiller: Using psi monitors for memory pressure detection
         1750850005.871771  lmkd   124   124 V lowmemorykiller: Process polling is supported
         1750850005.871996  lmkd   124   124 V lowmemorykiller: Process reaper initialized with 2 threads in the pool
         1750850005.872895  1000   125   125 D auditd  : avc=SELinux: Loaded service context from:
         1750850005.872898  1000   125   125 D auditd  : avc=		/system/etc/selinux/plat_service_contexts
         1750850005.872899  1000   125   125 D auditd  : avc=		/system_ext/etc/selinux/system_ext_service_contexts
         1750850005.872900  1000   125   125 D auditd  : avc=		/vendor/etc/selinux/vendor_service_contexts
         1750850005.874787  root   127   127 I qemu-props: successfully set property 'vendor.qemu.sf.fake_camera' to 'front'
         1750850005.874815  root   127   127 I qemu-props: successfully set property 'qemu.hw.mainkeys' to '0'
         1750850005.874833  root   127   127 I qemu-props: successfully set property 'qemu.sf.lcd_density' to '420'
         1750850005.874833  lmkd   124   124 W lowmemorykiller: This message won't make it to the snapshots because of buffering
`;

describe('AndroidParser chunked input', () => {
  it('parses entries correctly with chunked input', () => {
    const parser = new AndroidParser();
    // Use the first fixture as a sample
    const chunker = new Chunker(DUMP, 4);
    let entries: AndroidEntry[] = [];

    for (const chunk of chunker.getChunks()) {
      entries = entries.concat(parser.parse(chunk, false));
    }

    expect(entries).toMatchSnapshot();
  });

  it('ignores stderr', () => {
    const parser = new AndroidParser();
    const entries = parser.parse(DUMP, true);
    expect(entries).toEqual([]);
  });
});
