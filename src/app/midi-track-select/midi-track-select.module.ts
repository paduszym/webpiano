import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {MidiTrackSelectComponent} from './midi-track-select.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MidiTrackSelectComponent,
  ],
  exports: [
    MidiTrackSelectComponent,
  ],
})
export class MidiTrackSelectModule {
}
