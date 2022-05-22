import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {MIDI_ACCESS} from './app/midi-access/midi-access';
import {requestMidiAccess} from './app/midi-access/request-midi-access';
import {ngProdModeEnabled} from './env/env';

if (ngProdModeEnabled) {
  enableProdMode();
}

requestMidiAccess().then(midiAccess => {
  return platformBrowserDynamic([{provide: MIDI_ACCESS, useValue: midiAccess}]).bootstrapModule(AppModule);
});
