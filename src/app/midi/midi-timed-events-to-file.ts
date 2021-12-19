import {
  IMidiChannelPressureEvent, IMidiControlChangeEvent, IMidiEndOfTrackEvent, IMidiFile, IMidiKeyPressureEvent, IMidiNoteOffEvent,
  IMidiNoteOnEvent, IMidiPitchBendEvent, IMidiProgramChangeEvent, TMidiEvent, TMidiMetaEvent, TMidiStatusEvent,
} from 'midi-json-parser-worker';

import {MidiTimedEvent} from './midi-timed-event';

export function midiTimedEventsToFile(trackName: string, timedEvents: MidiTimedEvent[]): IMidiFile {
  const division: number = 384;
  const microsecondsPerQuarter: number = 500_000;
  const track: TMidiEvent[] = [
    {setTempo: {microsecondsPerQuarter}, delta: 0},
    {timeSignature: {denominator: 4, metronome: 24, numerator: 4, thirtyseconds: 8}, delta: 0},
    {trackName, delta: 0},
    ..._decodeTimedEvents(division, microsecondsPerQuarter, timedEvents),
  ];

  return {
    format: 0,
    division,
    tracks: [track],
  };
}

function _decodeTimedEvents(division: number, microsecondsPerQuarter: number, timedEvents: MidiTimedEvent[]): TMidiEvent[] {
  const events: any[] = [];
  const tickDuration: number = (microsecondsPerQuarter / 1000) / division;
  let prevTick: number = 0;

  for (const {time, data} of timedEvents) {
    const tick: number = Math.floor(time / tickDuration);
    events.push({delta: tick - prevTick, ..._decodeMidiEvent(data)});
    prevTick = tick;
  }

  return events;
}

function _decodeMidiEvent(data: Uint8Array): Omit<TMidiEvent, 'delta'> {
  const [status] = data;

  if (status === 0xff) {
    return _decodeMidiMetaEvent(data);
  }
  return _decodeMidiStatusEvent(data);
}

function _decodeMidiMetaEvent(data: Uint8Array): Omit<TMidiMetaEvent, 'delta'> {
  const [, data1] = data;

  if (data1 === 0x2f) {
    return {endOfTrack: true} as IMidiEndOfTrackEvent;
  }
  return {};
}

function _decodeMidiStatusEvent(data: Uint8Array): Omit<TMidiStatusEvent, 'delta'> {
  const [status, data1, data2] = data;
  const eventType: number = status >> 4;
  let event: Omit<TMidiStatusEvent, 'delta'>;

  if (eventType === 0x08) {
    event = {noteOff: {noteNumber: data1, velocity: data2}} as IMidiNoteOffEvent;
  } else if (eventType === 0x09) {
    if (data2 === 0) {
      event = {noteOff: {noteNumber: data1, velocity: data2}} as IMidiNoteOffEvent;
    } else {
      event = {noteOn: {noteNumber: data1, velocity: data2}} as IMidiNoteOnEvent;
    }
  } else if (eventType === 0x0a) {
    event = {keyPressure: {noteNumber: data1, pressure: data2}} as IMidiKeyPressureEvent;
  } else if (eventType === 0x0b) {
    event = {controlChange: {type: data1, value: data2}} as IMidiControlChangeEvent;
  } else if (eventType === 0x0c) {
    event = {programChange: {programNumber: data1}} as IMidiProgramChangeEvent;
  } else if (eventType === 0x0d) {
    event = {channelPressure: {pressure: data1}} as IMidiChannelPressureEvent;
  } else if (eventType === 0x0e) {
    event = {pitchBend: data1 | (data2 << 7)} as IMidiPitchBendEvent;
  } else {
    throw new Error(`Cannot parse a midi status event with a type of "${status}"`);
  }

  event['channel'] = status & 0x0f;

  return event;
}
