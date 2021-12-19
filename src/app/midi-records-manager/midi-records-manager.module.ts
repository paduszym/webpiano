import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {MidiRecordsManagerComponent} from './midi-records-manager.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MidiRecordsManagerComponent,
  ],
  exports: [
    MidiRecordsManagerComponent,
  ],
})
export class MidiRecordsManagerModule {
}
