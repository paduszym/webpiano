import {Injectable} from '@angular/core';
import {
  filter, finalize, from, interval, map, mapTo, Observable, of, pluck, scan, share, startWith, Subject, Subscription, switchMap,
  switchMapTo, tap,
} from 'rxjs';

import {MIDI_CLOCK_INTERVAL} from '../midi/midi-clock-interval';
import {MIDI_END_OF_TRACK_MESSAGE_DATA} from '../midi/midi-end-of-track-message-data';
import {MidiTimedEvent} from '../midi/midi-timed-event';
import {MidiInputPort} from '../midi-port/midi-input-port';
import {ScreenWakeLock} from '../screen-wake-lock/screen-wake-lock.service';

import {MidiRecorderState} from './midi-recorder-state';

@Injectable({
  providedIn: 'root',
})
export class MidiRecorder {

  private _inputPort: MidiInputPort;

  private _inputSubscription: Subscription = Subscription.EMPTY;

  private _stateChange$: Subject<Partial<MidiRecorderState>> = new Subject();

  private _startTime: number;

  private _recordedEvents: MidiTimedEvent[];

  private _state$: Observable<MidiRecorderState> = this._stateChange$.pipe(
    startWith({recording: false, tick: 0}),
    scan((state: MidiRecorderState, curr) => ({...state, ...curr}), {}),
    switchMap(state => state.recording ?
      from(this._screenWakeLock.acquire()).pipe(
        switchMapTo(interval(MIDI_CLOCK_INTERVAL).pipe(
          tap(() => state.tick++),
          mapTo(state),
          finalize(() => this._screenWakeLock.release()),
        )),
      ) : of(state),
    ),
    share(),
  );

  readonly recording$: Observable<boolean> = this._state$.pipe(
    pluck('recording'),
  );

  readonly time$: Observable<number> = this._state$.pipe(
    map(({tick}) => tick * MIDI_CLOCK_INTERVAL),
  );

  constructor(private _screenWakeLock: ScreenWakeLock) {
  }

  connect(port: MidiInputPort): void {
    this._inputPort = port;
  }

  record(): void {
    this._startTime = performance.now();
    this._recordedEvents = [];
    this._inputSubscription = this._inputPort.message$.pipe(
      filter(({data: [status]}) => status < 0xF0),
      map(({data, timeStamp}) => ({time: timeStamp - this._startTime, data})),
    ).subscribe(event => this._recordedEvents.push(event));
    this._stateChange$.next({recording: true, tick: 0});
  }

  stop(): MidiTimedEvent[] {
    this._inputPort.clear();
    this._inputSubscription.unsubscribe();
    this._recordedEvents.push({time: performance.now() - this._startTime, data: MIDI_END_OF_TRACK_MESSAGE_DATA});
    this._stateChange$.next({recording: false, tick: 0});

    return this._recordedEvents;
  }
}
