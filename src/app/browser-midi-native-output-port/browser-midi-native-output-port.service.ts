import {Injectable} from '@angular/core';
import {noop} from 'rxjs';

import {BrowserNativeMidiPort} from '../browser-midi-native-port/browser-native-midi-port';

@Injectable({
  providedIn: 'root',
})
export class BrowserMidiNativeOutputPort extends BrowserNativeMidiPort {

  readonly name: string = 'Host Speaker (not implemented yet)';

  readonly type: 'output' = 'output';

  readonly clear: () => void = noop;

  send(data: Uint8Array, timestamp?: number): void {
  }
}
