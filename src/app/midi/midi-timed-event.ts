export interface MidiTimedEvent {
  time: number;
  data: Uint8Array;
}

export function midiTimedEventSortFn(e1: MidiTimedEvent, e2: MidiTimedEvent): number {
  if (e1.time === e2.time) {
    return 0;
  }
  return e1.time > e2.time ? +1 : -1;
}
