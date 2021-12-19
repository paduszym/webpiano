import {filter, fromEvent, map, Observable, share, startWith, Subject} from 'rxjs';

import {Note} from '../note/note';
import {MidiNoteStatus} from './midi-note-status';

export abstract class MidiPort {

  private _stateChange$: Observable<WebMidi.MIDIConnectionEvent> = fromEvent<WebMidi.MIDIConnectionEvent>(this._nativePort, 'statechange');

  private _clear$: Subject<void> = new Subject();

  readonly id: string = this._nativePort.id;

  readonly name: string = this._nativePort.name;

  readonly manufacturer: string = this._nativePort.manufacturer;

  readonly version: string = this._nativePort.version;

  readonly deviceState$: Observable<WebMidi.MIDIPortDeviceState> = this._stateChange$.pipe(
    startWith(null),
    map(() => this._nativePort.state),
  );

  readonly connectionState$: Observable<WebMidi.MIDIPortConnectionState> = this._stateChange$.pipe(
    startWith(null),
    map(() => this._nativePort.connection),
  );

  readonly message$: Observable<WebMidi.MIDIMessageEvent> = this._createMessage$(this._nativePort).pipe(
    share(),
  );

  readonly sustainPushed$: Observable<boolean> = this.message$.pipe(
    filter(({data: [status, code]}) => status === 0xB0 && code === 0x40),
    map(({data: [, , velocity]}) => velocity === 0x7F),
  );

  readonly noteStatus$: Observable<MidiNoteStatus> = this.message$.pipe(
    filter(({data: [status]}) => status === 0x80 || status === 0x90),
    map(({data: [, code, velocity]}) => ({note: Note.fromCode(code), velocity})),
  );

  get clear$(): Observable<void> {
    return this._clear$;
  }

  constructor(private _nativePort: WebMidi.MIDIPort) {
  }

  open(): Promise<WebMidi.MIDIPort> {
    return this._nativePort.open();
  }

  close(): Promise<WebMidi.MIDIPort> {
    return  this._nativePort.close();
  }

  clear(): void {
    this._clear$.next();
  }

  protected abstract _createMessage$(nativePort: WebMidi.MIDIPort): Observable<WebMidi.MIDIMessageEvent>;
}
