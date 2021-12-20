import {CommonModule} from '@angular/common';
import {ErrorHandler as NgErrorHandler, NgModule} from '@angular/core';

import {ErrorHandler} from './error-handler.service';
import {ErrorHandlerComponent} from './error-handler.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ErrorHandlerComponent,
  ],
  exports: [
    ErrorHandlerComponent,
  ],
  providers: [
    ErrorHandler,
    {provide: NgErrorHandler, useExisting: ErrorHandler},
  ],
})
export class ErrorHandlerModule {
}
