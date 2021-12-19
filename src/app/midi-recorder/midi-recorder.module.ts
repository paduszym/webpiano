import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {FormatTimeModule} from '../format-time/format-time.module';

import {MidiRecorderComponent} from './midi-recorder.component';

@NgModule({
  imports: [
    CommonModule,
    /**/
    FormatTimeModule,
  ],
  declarations: [
    MidiRecorderComponent,
  ],
  exports: [
    MidiRecorderComponent,
  ],
})
export class MidiRecorderModule {
}
