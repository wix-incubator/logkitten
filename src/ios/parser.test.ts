import { Chunker } from '../__tests__/Chunker';
import { IosParser } from './parser';
import type { IosEntry } from './types';

const DUMP =
  [
    '{"timezoneName":"","messageType":"Default","eventType":"logEvent","source":null,"formatString":"Task <%{public,uuid_t}.16P>.<%lu> summary for %{public}s {transaction_duration_ms=%u, response_status=%ld, connection=%llu, reused=1, reused_after_ms=%u, request_start_ms=%u, request_duration_ms=%u, response_start_ms=%u, response_duration_ms=%u, request_bytes=%lld, request_throughput_kbps=%lld, response_bytes=%lld, response_throughput_kbps=%lld, cache_hit=%{bool}d}","userID":501,"activityIdentifier":0,"subsystem":"com.apple.CFNetwork","category":"Summary","threadID":154653588,"senderImageUUID":"28F30CFF-18C1-3FB9-B1E9-E185E004AC74","backtrace":{"frames":[{"imageOffset":265776,"imageUUID":"28F30CFF-18C1-3FB9-B1E9-E185E004AC74"}]},"bootUUID":"","processImagePath":"/Users/yaroslavs/Library/Developer/CoreSimulator/Devices/1C62AC87-73A4-4576-B440-DCE6F2A17B80/data/Containers/Bundle/Application/CEA9E514-252D-4EE2-9BA8-2E49AE389879/example.app/example","senderImagePath":"/Library/Developer/CoreSimulator/Volumes/iOS_22C150/Library/Developer/CoreSimulator/Profiles/Runtimes/iOS 18.2.simruntime/Contents/Resources/RuntimeRoot/System/Library/Frameworks/CFNetwork.framework/CFNetwork","timestamp":"2025-06-24 14:32:34.176682+0300","machTimestamp":79751022531929,"eventMessage":"Task <96F5582A-8C99-4035-AEC1-29C47714BAD5>.<2408> summary for task failure {transaction_duration_ms=12, response_status=-1, connection=2408, reused=1, reused_after_ms=0, request_start_ms=0, request_duration_ms=0, response_start_ms=0, response_duration_ms=0, request_bytes=0, request_throughput_kbps=0, response_bytes=0, response_throughput_kbps=0, cache_hit=false}","processImageUUID":"CB3E2FA6-7D71-315B-AF0B-6AC3D30F07FE","traceID":338696976352935940,"processID":87578,"senderProgramCounter":265776,"parentActivityIdentifier":0}',
    '{"timezoneName":"","messageType":"Info","eventType":"logEvent","source":null,"formatString":"[C%u %{public}s %{public}@] dealloc","userID":501,"activityIdentifier":0,"subsystem":"com.apple.network","category":"connection","threadID":154652000,"senderImageUUID":"2CB8C5CD-213F-3259-9533-78B2684F355E","backtrace":{"frames":[{"imageOffset":4176148,"imageUUID":"2CB8C5CD-213F-3259-9533-78B2684F355E"}]},"bootUUID":"","processImagePath":"/Users/yaroslavs/Library/Developer/CoreSimulator/Devices/1C62AC87-73A4-4576-B440-DCE6F2A17B80/data/Containers/Bundle/Application/CEA9E514-252D-4EE2-9BA8-2E49AE389879/example.app/example","senderImagePath":"/Library/Developer/CoreSimulator/Volumes/iOS_22C150/Library/Developer/CoreSimulator/Profiles/Runtimes/iOS 18.2.simruntime/Contents/Resources/RuntimeRoot/System/Library/Frameworks/Network.framework/Network","timestamp":"2025-06-24 14:32:57.470977+0300","machTimestamp":79751581592830,"eventMessage":"[C2430 Hostname#65c1aeb9:63995 tcp, url: http://localhost:63995/, definite, attribution: developer] dealloc","processImageUUID":"CB3E2FA6-7D71-315B-AF0B-6AC3D30F07FE","traceID":613355255849287940,"processID":87578,"senderProgramCounter":4176148,"parentActivityIdentifier":0}',
    '{"timezoneName":"","messageType":"Error","eventType":"logEvent","source":null,"formatString":"%{public}s %s Socket SO_ERROR %{darwin.errno}d","userID":501,"activityIdentifier":0,"subsystem":"com.apple.network","category":"connection","threadID":154652000,"senderImageUUID":"2CB8C5CD-213F-3259-9533-78B2684F355E","backtrace":{"frames":[{"imageOffset":9088656,"imageUUID":"2CB8C5CD-213F-3259-9533-78B2684F355E"}]},"bootUUID":"","processImagePath":"/Users/yaroslavs/Library/Developer/CoreSimulator/Devices/1C62AC87-73A4-4576-B440-DCE6F2A17B80/data/Containers/Bundle/Application/CEA9E514-252D-4EE2-9BA8-2E49AE389879/example.app/example","senderImagePath":"/Library/Developer/CoreSimulator/Volumes/iOS_22C150/Library/Developer/CoreSimulator/Profiles/Runtimes/iOS 18.2.simruntime/Contents/Resources/RuntimeRoot/System/Library/Frameworks/Network.framework/Network","timestamp":"2025-06-24 14:44:49.382837+0300","machTimestamp":79768667411910,"eventMessage":"nw_socket_handle_socket_event [C3103.1.1:2] Socket SO_ERROR [61: Connection refused]","processImageUUID":"CB3E2FA6-7D71-315B-AF0B-6AC3D30F07FE","traceID":615501266340286468,"processID":87578,"senderProgramCounter":9088656,"parentActivityIdentifier":0}',
    '{"timezoneName":"","messageType":"Debug","eventType":"logEvent","source":null,"formatString":"No threshold for %{public}s, returning NW_ACTIVITY_DURATION_INVALID","userID":501,"activityIdentifier":0,"subsystem":"com.apple.network","category":"activity","threadID":154652005,"senderImageUUID":"2CB8C5CD-213F-3259-9533-78B2684F355E","backtrace":{"frames":[{"imageOffset":8408124,"imageUUID":"2CB8C5CD-213F-3259-9533-78B2684F355E"}]},"bootUUID":"","processImagePath":"/Users/yaroslavs/Library/Developer/CoreSimulator/Devices/1C62AC87-73A4-4576-B440-DCE6F2A17B80/data/Containers/Bundle/Application/CEA9E514-252D-4EE2-9BA8-2E49AE389879/example.app/example","senderImagePath":"/Library/Developer/CoreSimulator/Volumes/iOS_22C150/Library/Developer/CoreSimulator/Profiles/Runtimes/iOS 18.2.simruntime/Contents/Resources/RuntimeRoot/System/Library/Frameworks/Network.framework/Network","timestamp":"2025-06-24 14:33:21.817334+0300","machTimestamp":79752165903163,"eventMessage":"No threshold for cfnetwork:foreground_task, returning NW_ACTIVITY_DURATION_INVALID","processImageUUID":"CB3E2FA6-7D71-315B-AF0B-6AC3D30F07FE","traceID":615159717639225860,"processID":87578,"senderProgramCounter":8408124,"parentActivityIdentifier":0}',
  ].join('\n') + '\n';

describe('IosParser chunked input', () => {
  it('parses entries correctly with chunked input', () => {
    const parser = new IosParser();
    // Use the first fixture as a sample
    const chunker = new Chunker(DUMP, 4);
    let entries: IosEntry[] = [];
    for (const chunk of chunker.getChunks()) {
      entries = entries.concat(parser.parse(chunk, false));
    }
    expect(entries).toMatchSnapshot();
  });

  it('handles stderr appropriately', () => {
    const parser = new IosParser();

    // Should throw specific error for no devices
    expect(() => parser.parse('No devices are booted.\n', true)).toThrow(
      'No simulators are booted.'
    );

    // Should ignore uid errors silently
    const entries = parser.parse(
      'getpwuid_r did not find a match for uid\n',
      true
    );
    expect(entries).toEqual([]);

    // Should throw for unknown errors
    expect(() => parser.parse('Some random error\n', true)).toThrow(
      'Some random error'
    );
  });
});
