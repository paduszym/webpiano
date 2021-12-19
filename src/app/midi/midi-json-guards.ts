import {IMidiSetTempoEvent} from 'midi-json-parser-worker';

export function isIMidiSetTempoEvent(obj: any): obj is IMidiSetTempoEvent {
  return obj && obj.setTempo;
}
