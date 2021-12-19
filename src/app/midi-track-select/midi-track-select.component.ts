import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {parseArrayBuffer} from 'midi-json-parser';

import {MidiRecordsList} from '../midi-records-list/midi-records-list.service';
import {MidiRecord} from '../midi/midi-record';
import {MidiTrack} from '../midi/midi-track';

@Component({
  selector: 'wpn-midi-track-select',
  templateUrl: './midi-track-select.component.html',
  styleUrls: ['./midi-track-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MidiTrackSelectComponent {

  _recordsListVisible: boolean = false;

  @Input()
  disabled: boolean = false;

  @Output()
  readonly trackChange: EventEmitter<MidiTrack> = new EventEmitter();

  constructor(public _recordsList: MidiRecordsList) {
  }

  _selectTrackFromFile(fileList: FileList): void {
    const file: File = fileList.item(0);

    if (file) {
      file.arrayBuffer()
        .then(parseArrayBuffer)
        .then(midiFile => MidiTrack.fromFile(midiFile, file.name))
        .then(track => this.trackChange.emit(track));
    }
  }

  _selectTrackFromRecordsList(record: MidiRecord): void {
    this._selectTrackFromRecord(record);
    this._recordsListVisible = false;
  }

  _selectTrackFromRecord(record: MidiRecord): void {
    this.trackChange.emit(MidiTrack.fromRecord(record));
  }
}
