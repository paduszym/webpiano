import {mapTo, merge, Observable} from 'rxjs';

import {MidiInputPort} from '../midi-port/midi-input-port';
import {MidiOutputPort} from '../midi-port/midi-output-port';
import {MidiPort} from '../midi-port/midi-port';

export class PianoSustain {

  readonly inputPushed$: Observable<boolean> = PianoSustain._createPushed$(this._inputPort);

  readonly outputPushed$: Observable<boolean> = PianoSustain._createPushed$(this._outputPort);

  constructor(private _inputPort: MidiInputPort,
              private _outputPort: MidiOutputPort) {
  }

  private static _createPushed$(port: MidiPort): Observable<boolean> {
    return merge(port.sustainPushed$, port.clear$.pipe(mapTo(false)));
  }
}
