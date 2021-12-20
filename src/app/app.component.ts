import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MidiInputPort} from './midi-port/midi-input-port';
import {MidiOutputPort} from './midi-port/midi-output-port';

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

  _inputPort: MidiInputPort = this._ports.getInputById(localStorage.getItem(`webpiano.port.input`) || null);

  _outputPort: MidiOutputPort = this._ports.getOutputById(localStorage.getItem(`webpiano.port.input`) || null);

  _track: MidiTrack;

  constructor(public _ports: MidiPorts) {
  }

  _activateTab(tab: WebMidi.MIDIPortType): void {
    console.log(this._track.chunksCount);
    this._activeTab = tab;
    localStorage.setItem('webpiano.activeTab', this._activeTab);
  }

  _outputPortChanged(port: MidiOutputPort): void {
    localStorage.setItem('webpiano.port.output', port.id);
  }

  _inputPortChanged(port: MidiInputPort): void {
    localStorage.setItem('webpiano.port.input', port.id);
  }

  _pianoShowNotesChanged(showNotes: boolean): void {
    localStorage.setItem('webpiano.showNotes', `${showNotes}`);
  }
}
