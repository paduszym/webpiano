import {Injectable} from '@angular/core';
import {defer, from, fromEvent, map, mapTo, merge, Observable, of, startWith, switchMap, tap} from 'rxjs';

import {BrowserMidiNativeInputPort} from '../browser-midi-native-input-port/browser-midi-native-input-port.service';
import {BrowserMidiNativeOutputPort} from '../browser-midi-native-output-port/browser-midi-native-output-port.service';

import {MidiInputPort} from '../midi-port/midi-input-port';
import {MidiOutputPort} from '../midi-port/midi-output-port';

@Injectable({
  providedIn: 'root',
})
export class MidiPorts {

  private _midiAccess$: Observable<WebMidi.MIDIAccess> = defer(() => from(navigator.requestMIDIAccess())).pipe(
    switchMap(midiAccess => merge(
      of(midiAccess),
      fromEvent(midiAccess, 'statechange').pipe(mapTo(midiAccess)),
    )),
  );

  readonly browserInputPort: MidiInputPort = new MidiInputPort(this._browserMidiInputPort);

  readonly browserOutputPort: MidiOutputPort = new MidiOutputPort(this._browserMidiOutputPort);

  readonly inputs$: Observable<MidiInputPort[]> = this._midiAccess$.pipe(
    startWith({inputs: []}),
    map(({inputs}) => [
      this.browserInputPort,
      ...Array.from(inputs.values()).map(midiInput => new MidiInputPort(midiInput)),
    ]),
  );

  readonly outputs$: Observable<MidiOutputPort[]> = this._midiAccess$.pipe(
    startWith({outputs: []}),
    map(({outputs}) => [
      this.browserOutputPort,
      ...Array.from(outputs.values()).map(midiOutput => new MidiOutputPort(midiOutput)),
    ]),
  );

  constructor(private _browserMidiInputPort: BrowserMidiNativeInputPort,
              private _browserMidiOutputPort: BrowserMidiNativeOutputPort) {
  }
}
