import {fromEvent, Observable} from 'rxjs';

import {MidiPort} from './midi-port';

export class MidiInputPort extends MidiPort {

  protected _createMessage$(nativeInputPort: WebMidi.MIDIInput): Observable<WebMidi.MIDIMessageEvent> {
    return fromEvent<WebMidi.MIDIMessageEvent>(nativeInputPort, 'midimessage');
  }
}
