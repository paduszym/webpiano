import {formatDate} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {filter, map, Observable, shareReplay} from 'rxjs';

import {MidiInputPort} from '../midi-port/midi-input-port';
import {MidiRecordsList} from '../midi-records-list/midi-records-list.service';
import {MidiTimedEvent} from '../midi/midi-timed-event';

import {MidiRecorder} from './midi-recorder.service';

@Component({
  selector: 'wpn-midi-recorder',
  templateUrl: './midi-recorder.component.html',
  styleUrls: ['./midi-recorder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MidiRecorderComponent implements OnChanges {

  readonly _time$: Observable<number> = this._recorder.time$.pipe(shareReplay(1));

  readonly _recordingDotVisible$: Observable<boolean> = this._time$.pipe(
    filter(time => time % 500 === 0),
    map(time => time % 1000 === 0),
  );

  readonly recording$: Observable<boolean> = this._recorder.recording$.pipe(shareReplay(1));

  @Input()
  inputPort: MidiInputPort;

  constructor(private _recorder: MidiRecorder,
              private _recordsList: MidiRecordsList) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputPort']) {
      this._recorder.connect(this.inputPort);
    }
  }

  _record(): void {
    this._recorder.record();
  }

  _stop(): void {
    const recordedEvents: MidiTimedEvent[] = this._recorder.stop();
    const defaultTrackTitle: string = formatDate(new Date(), 'yyyy-MM-dd_HH.mm.ss', 'en');
    const trackTitle: string = prompt('Enter track name:', defaultTrackTitle);

    if (trackTitle !== null) {
      this._recordsList.add(trackTitle, recordedEvents).subscribe({
        error: err => alert(err),
      });
    }
  }
}

