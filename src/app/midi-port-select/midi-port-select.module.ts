import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {MidiPortSelectComponent} from './midi-port-select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    MidiPortSelectComponent,
  ],
  exports: [
    MidiPortSelectComponent,
  ],
})
export class MidiPortSelectModule {
}
