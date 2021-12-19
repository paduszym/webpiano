import {encode} from 'json-midi-message-encoder';
import {IMidiFile, TMidiEvent} from 'midi-json-parser-worker';
import {isIMidiSetTempoEvent} from './midi-json-guards';

import {MidiTimedEvent} from './midi-timed-event';

export function midiFileToTimedEvents(file: IMidiFile): MidiTimedEvent[] {
  let events: MidiTimedEvent[] = [];

  if (file.format === 0) {
    events = _midi0FileToEvents(file);
  } else if (file.format === 1) {
    events = _midi1FileToEvents(file);
  }
  return events;
}

function _midi0FileToEvents(file: IMidiFile): MidiTimedEvent[] {
  const events: MidiTimedEvent[] = [];
  const [track] = file.tracks;
  const [defaultDuration, tickDurationsMap] = _extractTempoMetadata(file, track);

  _appendTrackEvents(events, track, tickDurationsMap, defaultDuration);

  return events;
}

function _midi1FileToEvents(file: IMidiFile): MidiTimedEvent[] {
  const events: MidiTimedEvent[] = [];
  const [tempoTrack, ...tracks] = file.tracks;
  const [defaultDuration, tickDurationsMap] = _extractTempoMetadata(file, tempoTrack);

  for (const track of tracks) {
    _appendTrackEvents(events, track, tickDurationsMap, defaultDuration);
  }

  return events;
}

export function _extractTempoMetadata(file: IMidiFile, track: TMidiEvent[]): [number, Map<number, number>] {
  const tickDurationsMap: Map<number, number> = new Map();
  let duration: number;
  let currTick: number = 0;

  for (const event of track) {
    if (isIMidiSetTempoEvent(event)) {
      duration = (event.setTempo.microsecondsPerQuarter / 1000) / file.division;

      for (let tick: number = 0; tick < event.delta; ++tick) {
        tickDurationsMap.set(currTick++, duration);
      }
    }
  }

  return [duration, tickDurationsMap];
}

export function _appendTrackEvents(events: MidiTimedEvent[], track: TMidiEvent[], tickDurationsMap: Map<number, number>,
                                   defaultDuration: number): void {
  let currTick: number = 0;
  let time: number = 0;

  for (const event of track) {
    for (let tick: number = 0; tick < event.delta; ++tick) {
      time += tickDurationsMap.get(currTick++) || defaultDuration;
    }
    if ('controlChange' in event || 'noteOff' in event || 'noteOn' in event || 'programChange' in event) {
      events.push({time, data: new Uint8Array(encode(event))});
    }
  }
}
