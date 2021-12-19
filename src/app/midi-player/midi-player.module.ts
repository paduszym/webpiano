import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {FormatTimeModule} from '../format-time/format-time.module';

import {MidiPlayerComponent} from './midi-player.component';

@NgModule({
  imports: [
    CommonModule,
    /**/
    FormatTimeModule,
  ],
  declarations: [
    MidiPlayerComponent,
  ],
  exports: [
    MidiPlayerComponent,
  ],
})
export class MidiPlayerModule {
}
