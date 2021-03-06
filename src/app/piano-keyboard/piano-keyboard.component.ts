import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MidiPort} from '../midi-port/midi-port';

import {Note} from '../note/note';

import {PianoKey} from './piano-key';
import {PianoSustain} from './piano-sustain';

@Component({
  selector: 'wpn-piano-keyboard',
  templateUrl: './piano-keyboard.component.html',
  styleUrls: ['./piano-keyboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PianoKeyboardComponent implements OnChanges {

  _keys: PianoKey[] = [];

  _sustain: PianoSustain;

  _whiteKeysCount: number = 0;

  @Input()
  showNoteNames: boolean = true;

  @Output()
  readonly showNoteNamesChange: EventEmitter<boolean> = new EventEmitter(false);

  @Input()
  port: MidiPort;

  @Input()
  startNote: Note;

  @Input()
  endNote: Note;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['port'] || changes['startNote'] || changes['endNote']) {
      const keyboardNotes: Note[] = Note.range(this.startNote, this.endNote);

      this._keys = keyboardNotes.map(note => new PianoKey(note, this.port));
      this._whiteKeysCount = keyboardNotes.filter(({pitch}) => !pitch.endsWith('#')).length;
      this._sustain = new PianoSustain(this.port);
    }
  }
}
