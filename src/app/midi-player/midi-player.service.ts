import {Injectable} from '@angular/core';
import {
  finalize, from, interval, map, mapTo, Observable, of, pluck, scan, share, startWith, Subject, switchMap, switchMapTo, tap,
} from 'rxjs';

import {MidiOutputPort} from '../midi-port/midi-output-port';
import {MIDI_CLOCK_INTERVAL} from '../midi/midi-clock-interval';
import {MidiTrack} from '../midi/midi-track';
import {ScreenWakeLock} from '../screen-wake-lock/screen-wake-lock.service';
import {MidiPlayerState} from './midi-player-state';

@Injectable({
  providedIn: 'root',
})
export class MidiPlayer {

  private _outputPort: MidiOutputPort;

  private _track: MidiTrack;

  private _stateChange$: Subject<Partial<MidiPlayerState>> = new Subject();

  private _state$: Observable<MidiPlayerState> = this._stateChange$.pipe(
    startWith({playing: false, tick: 0}),
    scan((state: MidiPlayerState, curr) => ({...state, ...curr}), {}),
    switchMap(state => state.playing ?
      from(this._screenWakeLock.acquire()).pipe(
        switchMapTo(interval(MIDI_CLOCK_INTERVAL).pipe(
          tap(() => this._track.playChunk(this._outputPort, state.tick)),
          tap(() => state.tick = (state.tick + 1) % this._track.chunksCount),
          mapTo(state),
          finalize(() => this._screenWakeLock.release()),
        )),
      ) : of(state),
    ),
    share(),
  );

  readonly playing$: Observable<boolean> = this._state$.pipe(
    pluck('playing'),
  );

  readonly time$: Observable<number> = this._state$.pipe(
    map(({tick}) => tick * MIDI_CLOCK_INTERVAL),
  );

  constructor(private _screenWakeLock: ScreenWakeLock) {
  }

  connect(port: MidiOutputPort): void {
    this._outputPort = port;
  }

  open(track: MidiTrack): void {
    this._stateChange$.next({playing: false, tick: 0});
    this._outputPort.clear();
    this._track = track;
  }

  play(): void {
    this._stateChange$.next({playing: true});
  }

  pause(): void {
    this._stateChange$.next({playing: false});
  }
}
