import {Injectable, ErrorHandler as NgErrorHandler} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class ErrorHandler implements NgErrorHandler {

  private _error$: Subject<string> = new Subject();

  get error$(): Observable<string> {
    return this._error$;
  }

  handleError(error: any): void {
    this._error$.next(error ? error.stack || error.toString : 'Unknown error');
  }
}
