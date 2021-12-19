import {APP_INITIALIZER, NgModule} from '@angular/core';
import {midiRecordsDbAppInitializerFactory} from './midi-records-db-app-initializer-factory';

import {MidiRecordsDb} from './midi-records-db.service';

@NgModule({
  providers: [
    {provide: APP_INITIALIZER, useFactory: midiRecordsDbAppInitializerFactory, deps: [MidiRecordsDb], multi: true},
  ],
})
export class MidiRecordsDbModule {
}
