import {filter, map, mapTo, merge, Observable, startWith} from 'rxjs';
import {MidiPort} from '../midi-port/midi-port';

import {Note} from '../note/note';

export type PianoKeyColor = 'white' | 'black';

export class PianoKey {

  readonly velocity$: Observable<number> = merge(
    this._port.clear$.pipe(mapTo(0)),
    this._port.noteStatus$.pipe(
      filter(({note: {code}}) => code === this.note.code),
      map(({velocity}) => .1 * Math.floor(velocity / 12)),
      startWith(0),
    ),
  );

  readonly active$: Observable<boolean> = this.velocity$.pipe(
    map(velocity => velocity > 0),
  );

  readonly color: PianoKeyColor = this.note.pitch.endsWith('#') ? 'black' : 'white';

  constructor(public readonly note: Note,
              private _port: MidiPort) {
  }
}
