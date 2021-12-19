import {IMidiFile} from 'midi-json-parser-worker';

import {MidiOutputPort} from '../midi-port/midi-output-port';
import {extractMidiFileTitle} from './extract-midi-file-title';

import {MIDI_CLOCK_INTERVAL} from './midi-clock-interval';
import {isEndOfTrackMidiMessageData} from './midi-end-of-track-message-data';
import {midiFileToTimedEvents} from './midi-file-to-timed-events';
import {MidiRecord} from './midi-record';
import {MidiTimedEvent, midiTimedEventSortFn} from './midi-timed-event';

export class MidiTrack {

  private readonly _events: MidiTimedEvent[];

  private readonly _duration: number;

  private readonly _eventChunks: MidiTimedEvent[][];

  get title(): string {
    return this._title;
  }

  get chunksCount(): number {
    return this._eventChunks.length;
  }

  get duration(): number {
    return this._duration;
  }

  static fromFile(file: IMidiFile, fallbackTitle?: string): MidiTrack {
    return new MidiTrack(extractMidiFileTitle(file) || fallbackTitle, midiFileToTimedEvents(file));
  }

  static fromRecord(record: MidiRecord): MidiTrack {
    return new MidiTrack(record.title, record.events);
  }

  private constructor(private readonly _title: string, events: MidiTimedEvent[]) {
    this._events = (events || []).sort(midiTimedEventSortFn);
    this._duration = this._calculateDuration();
    this._eventChunks = this._createEventChunks();
  }

  playChunk(port: MidiOutputPort, tick: number): void {
    for (const event of this._eventChunks[tick]) {
      port.send(event.data, performance.now() + event.time);
    }
  }

  private _calculateDuration(): number {
    if (this._events.length > 0) {
      return this._events[this._events.length - 1].time;
    }
    return 0;
  }

  private _createEventChunks(): MidiTimedEvent[][] {
    const chunksMap: Map<number, MidiTimedEvent[]> = new Map();
    const ticksCount: number = Math.ceil(this._duration / MIDI_CLOCK_INTERVAL);

    for (let chunkIdx: number = 0; chunkIdx < ticksCount; ++chunkIdx) {
      chunksMap.set(chunkIdx, []);
    }
    for (const {time, data} of this._events) {
      if (!isEndOfTrackMidiMessageData(data)) {
        const tick: number = Math.floor(time / MIDI_CLOCK_INTERVAL);
        chunksMap.get(tick).push({time: time - tick * MIDI_CLOCK_INTERVAL, data});
      }
    }

    return Array.from(chunksMap.values());
  }
}
