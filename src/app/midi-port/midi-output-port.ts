import {Observable, of, Subject} from 'rxjs';
import {delay} from 'rxjs/operators';

import {MidiPort} from './midi-port';

export class MidiOutputPort extends MidiPort {

  private _message$: Subject<WebMidi.MIDIMessageEvent>;

  constructor(private _nativeOutputPort: WebMidi.MIDIOutput) {
    super(_nativeOutputPort);
  }

  send(data: Uint8Array, timestamp?: number): void {
    this._nativeOutputPort.send(data, timestamp);

    if (timestamp === undefined) {
      this._message$.next({data} as WebMidi.MIDIMessageEvent);
    } else {
      of({data} as WebMidi.MIDIMessageEvent).pipe(delay(timestamp - performance.now())).subscribe(event => {
        this._message$.next(event);
      });
    }
  }

  protected _createMessage$(): Observable<WebMidi.MIDIMessageEvent> {
    this._message$ = new Subject();
    return this._message$;
  }
}
