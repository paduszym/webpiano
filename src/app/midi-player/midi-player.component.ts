import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Observable, shareReplay} from 'rxjs';
import {MidiOutputPort} from '../midi-port/midi-output-port';
import {MidiTrack} from '../midi/midi-track';

import {MidiPlayer} from './midi-player.service';

@Component({
  selector: 'wpn-midi-player',
  templateUrl: './midi-player.component.html',
  styleUrls: ['./midi-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MidiPlayerComponent implements OnChanges {

  readonly _time$: Observable<number> = this._player.time$.pipe(shareReplay(1));

  readonly playing$: Observable<boolean> = this._player.playing$.pipe(shareReplay(1));

  @Input()
  outputPort: MidiOutputPort;

  @Input()
  track: MidiTrack;

  constructor(private _player: MidiPlayer) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['outputPort']) {
      this._player.connect(this.outputPort);
    }
    if (changes['track']) {
      this._player.open(this.track);
    }
  }

  _play(): void {
    this._player.play();
  }

  _pause(): void {
    this._player.pause();
  }
}

