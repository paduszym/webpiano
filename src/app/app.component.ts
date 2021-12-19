import {ChangeDetectionStrategy, Component} from '@angular/core';
import {map, Observable} from 'rxjs';
import {MidiInputPort} from './midi-port/midi-input-port';
import {MidiOutputPort} from './midi-port/midi-output-port';
import {MidiPort} from './midi-port/midi-port';

import {MidiPorts} from './midi-ports/midi-ports.service';
import {MidiTrack} from './midi/midi-track';
import {Note} from './note/note';

@Component({
  selector: 'wpn-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  _pianoStartNote: Note = Note.fromName('A0');

  _pianoEndNote: Note = Note.fromName('C8');

  _pianoShowNotes: boolean = localStorage.getItem('webpiano.showNotes') === 'true';

  _activeTab: WebMidi.MIDIPortType = localStorage.getItem('webpiano.activeTab') === 'input' ? 'input' : 'output';

  _inputPort: MidiInputPort = this._ports.browserInputPort;

  _initialInputPort$: Observable<MidiInputPort> = this._ports.inputs$.pipe(
    map(ports => this._getInitialPort(ports, 'input', this._ports.browserInputPort)),
  );

  _outputPort: MidiOutputPort = this._ports.browserOutputPort;

  _initialOutputPort$: Observable<MidiOutputPort> = this._ports.outputs$.pipe(
    map(ports => this._getInitialPort(ports, 'output', this._ports.browserOutputPort)),
  );

  _track: MidiTrack;

  constructor(public _ports: MidiPorts) {
  }

  _activateTab(tab: WebMidi.MIDIPortType): void {
    this._activeTab = tab;
    localStorage.setItem('webpiano.activeTab', this._activeTab);
  }

  _outputPortChanged(port: MidiOutputPort): void {
    this._outputPort = port;
    localStorage.setItem('webpiano.port.output', port.id);
  }

  _inputPortChanged(port: MidiInputPort): void {
    this._inputPort = port;
    localStorage.setItem('webpiano.port.input', port.id);
  }

  _pianoShowNotesChanged(showNotes: boolean): void {
    localStorage.setItem('webpiano.showNotes', `${showNotes}`);
  }

  private _getInitialPort<T extends MidiPort>(ports: T[], type: WebMidi.MIDIPortType, defaultPort: T): T {
    const portId: string = localStorage.getItem(`webpiano.port.${type}`) || null;
    return ports.find(({id}) => id === portId) || defaultPort;
  }
}
