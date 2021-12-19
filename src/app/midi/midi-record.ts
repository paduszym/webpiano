import {MidiTimedEvent} from './midi-timed-event';

export interface MidiRecord {
  title: string,
  date: Date;
  events: MidiTimedEvent[];
}

export function midiRecordSortFn(r1: MidiRecord, r2: MidiRecord): number {
  if (r1.date === r2.date) {
    return 0;
  }
  return r1.date > r2.date ? -1 : +1;
}
