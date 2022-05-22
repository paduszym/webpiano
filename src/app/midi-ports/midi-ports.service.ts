import {Inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, fromEvent, Subject, takeUntil} from 'rxjs';

import {BrowserMidiNativeInputPort} from '../browser-midi-native-input-port/browser-midi-native-input-port.service';
import {BrowserMidiNativeOutputPort} from '../browser-midi-native-output-port/browser-midi-native-output-port.service';
import {MidiInputPort} from '../midi-port/midi-input-port';
import {MidiOutputPort} from '../midi-port/midi-output-port';
import {MIDI_ACCESS} from '../midi-access/midi-access';

@Injectable({
  providedIn: 'root',
})
export class MidiPorts implements OnDestroy {

  private _destroy$: Subject<void> = new Subject();

  private _browserInputPort: MidiInputPort = new MidiInputPort(this._browserMidiNativeInputPort);

  private _browserOutputPort: MidiOutputPort = new MidiOutputPort(this._browserMidiNativeOutputPort);

  private _inputs$: BehaviorSubject<MidiInputPort[]> = new BehaviorSubject(this._createInputPorts());

  private _outputs$: BehaviorSubject<MidiOutputPort[]> = new BehaviorSubject(this._createOutputPorts());

  get inputs$(): BehaviorSubject<MidiInputPort[]> {
    return this._inputs$;
  }

  get outputs$(): BehaviorSubject<MidiOutputPort[]> {
    return this._outputs$;
  }

  get inputs(): MidiInputPort[] {
    return this._inputs$.value;
  }

  get outputs(): MidiOutputPort[] {
    return this._outputs$.value;
  }

  constructor(@Inject(MIDI_ACCESS) private _midiAccess: WebMidi.MIDIAccess,
              private _browserMidiNativeInputPort: BrowserMidiNativeInputPort,
              private _browserMidiNativeOutputPort: BrowserMidiNativeOutputPort) {
    fromEvent(this._midiAccess, 'statechange').pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._inputs$.next(this._createInputPorts());
      this._outputs$.next(this._createOutputPorts());
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getInputById(id: string): MidiInputPort {
    return this.inputs.find(port => port.id === id) || this._browserInputPort;
  }

  getOutputById(id: string): MidiOutputPort {
    return this.outputs.find(port => port.id === id) || this._browserOutputPort;
  }

  private _createInputPorts(): MidiInputPort[] {
    return [
      this._browserInputPort,
      ...Array.from(this._midiAccess.inputs.values()).map(midiInput => new MidiInputPort(midiInput)),
    ];
  }

  private _createOutputPorts(): MidiOutputPort[] {
    return [
      this._browserOutputPort,
      ...Array.from(this._midiAccess.outputs.values()).map(midiOutput => new MidiOutputPort(midiOutput)),
    ];
  }
}
