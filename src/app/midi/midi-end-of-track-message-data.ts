import {encode} from 'json-midi-message-encoder';

export const MIDI_END_OF_TRACK_MESSAGE_DATA: Uint8Array = new Uint8Array(encode({endOfTrack: true, delta: 0}));

export function isEndOfTrackMidiMessageData(data: Uint8Array): boolean {
  return data[0] === MIDI_END_OF_TRACK_MESSAGE_DATA[0] &&
    data[1] === MIDI_END_OF_TRACK_MESSAGE_DATA[1] &&
    data[2] === MIDI_END_OF_TRACK_MESSAGE_DATA[2];
}
