import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {MIDI_ACCESS} from './app/midi-ports/midi-access';
import {ngProdModeEnabled} from './env/env';

if (ngProdModeEnabled) {
  enableProdMode();
}

navigator.requestMIDIAccess().then(midiAccess => {
  return platformBrowserDynamic([{provide: MIDI_ACCESS, useValue: midiAccess}]).bootstrapModule(AppModule);
});
