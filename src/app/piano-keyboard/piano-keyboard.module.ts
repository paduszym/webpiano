import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {PianoKeyboardComponent} from './piano-keyboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    PianoKeyboardComponent,
  ],
  exports: [
    PianoKeyboardComponent,
  ],
})
export class PianoKeyboardModule {
}
