import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';

import {ngProdModeEnabled} from '../env/env';

import {AppComponent} from './app.component';
import {ErrorHandlerModule} from './error-handler/error-handler.module';
import {MidiPlayerModule} from './midi-player/midi-player.module';
import {MidiPortSelectModule} from './midi-port-select/midi-port-select.module';
import {MidiRecorderModule} from './midi-recorder/midi-recorder.module';
import {MidiRecordsDbModule} from './midi-records-db/midi-records-db.module';
import {MidiRecordsManagerModule} from './midi-records-manager/midi-records-manager.module';
import {MidiTrackSelectModule} from './midi-track-select/midi-track-select.module';
import {PianoKeyboardModule} from './piano-keyboard/piano-keyboard.module';

@NgModule({
  imports: [
    NoopAnimationsModule,
    /**/
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: ngProdModeEnabled,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    /**/
    ErrorHandlerModule,
    MidiRecordsDbModule,
    MidiRecordsManagerModule,
    MidiTrackSelectModule,
    MidiPortSelectModule,
    MidiPlayerModule,
    MidiRecorderModule,
    PianoKeyboardModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
