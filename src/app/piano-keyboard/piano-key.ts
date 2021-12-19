import {combineLatest, filter, map, mapTo, merge, Observable, startWith} from 'rxjs';

import {Note} from '../note/note';
import {MidiInputPort} from '../midi-port/midi-input-port';
import {MidiOutputPort} from '../midi-port/midi-output-port';
import {MidiPort} from '../midi-port/midi-port';

export type PianoKeyColor = 'white' | 'black';

export class PianoKey {

  readonly inputVelocity$: Observable<number> = this._createVelocity$(this._inputPort);

  readonly outputVelocity$: Observable<number> = this._createVelocity$(this._outputPort);

  readonly active$: Observable<boolean> = combineLatest([this.inputVelocity$, this.outputVelocity$]).pipe(
    map(([inputVelocity, outputVelocity]) => inputVelocity > 0 || outputVelocity > 0),
  );

  readonly color: PianoKeyColor = this.note.pitch.endsWith('#') ? 'black' : 'white';

  constructor(public readonly note: Note,
              private _inputPort: MidiInputPort,
              private _outputPort: MidiOutputPort) {
  }

  private _createVelocity$(pianoPort: MidiPort): Observable<number> {
    return merge(
      pianoPort.clear$.pipe(mapTo(0)),
      pianoPort.noteStatus$.pipe(
        filter(({note: {code}}) => code === this.note.code),
        map(({velocity}) => .1 * Math.floor(velocity / 12)),
        startWith(0),
      ),
    );
  }
}
