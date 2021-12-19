import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {encode} from 'json-midi-encoder';

import {FileDownloader} from '../file-downloader/file-downloader.service';
import {MidiRecordsList} from '../midi-records-list/midi-records-list.service';
import {MidiRecord} from '../midi/midi-record';
import {midiTimedEventsToFile} from '../midi/midi-timed-events-to-file';
import {MidiTrack} from '../midi/midi-track';

@Component({
  selector: 'wpn-midi-records-manager',
  templateUrl: './midi-records-manager.component.html',
  styleUrls: ['./midi-records-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    FileDownloader,
  ],
})
export class MidiRecordsManagerComponent {

  _recordsListVisible: boolean = false;

  @Input()
  disabled: boolean = false;

  @Output()
  readonly valueChange: EventEmitter<MidiTrack> = new EventEmitter();

  constructor(private _fileDownloader: FileDownloader,
              public _recordsList: MidiRecordsList) {
  }

  _deleteRecord(record: MidiRecord): void {
    if (confirm('Delete record?')) {
      this._recordsList.remove(record).subscribe({
        error: err => alert(err),
      });
    }
  }

  _clearRecordsList(): void {
    if (confirm('Clear list?')) {
      this._recordsList.clear().subscribe({
        error: err => alert(err),
      });
    }
  }

  _saveAsMidi(record: MidiRecord): void {
    encode(midiTimedEventsToFile(record.title, record.events)).then(arrayBuffer => {
      this._fileDownloader.downloadBlob(new Blob([arrayBuffer]), `${record.title}.mid`);
    });
  }
}
