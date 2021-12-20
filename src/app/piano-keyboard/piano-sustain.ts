import {mapTo, merge, Observable} from 'rxjs';
import {MidiPort} from '../midi-port/midi-port';

export class PianoSustain {

  readonly pushed$: Observable<boolean> = merge(this._port.clear$.pipe(mapTo(false)), this._port.sustainPushed$);

  constructor(private _port: MidiPort) {
  }
}
