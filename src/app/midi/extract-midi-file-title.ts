import {IMidiFile, IMidiTrackNameEvent} from 'midi-json-parser-worker';

export function extractMidiFileTitle(midiFile: IMidiFile): string {
  for (const track of midiFile.tracks) {
    const trackNameEvent: IMidiTrackNameEvent = track.find(event => 'trackName' in event) as IMidiTrackNameEvent;

    if (trackNameEvent) {
      return trackNameEvent.trackName;
    }
  }
  return '(Untitled track)';
}
