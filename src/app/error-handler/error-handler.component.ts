import {ChangeDetectionStrategy, Component} from '@angular/core';

import {ErrorHandler} from './error-handler.service';

@Component({
  selector: 'wpn-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorHandlerComponent {

  constructor(public _errorHandler: ErrorHandler) {
  }
}
