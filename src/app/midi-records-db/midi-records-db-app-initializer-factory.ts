import {firstValueFrom} from 'rxjs';

import {MidiRecordsDb} from './midi-records-db.service';

export function midiRecordsDbAppInitializerFactory(db: MidiRecordsDb): () => void {
  return () => firstValueFrom(db.init());
}
