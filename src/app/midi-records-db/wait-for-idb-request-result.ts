import {fromEvent, map, Observable, race, switchMap, take, throwError} from 'rxjs';

export function waitForIdbRequestResult<T>(request: IDBRequest<T>): Observable<T> {
  const success$: Observable<T> = fromEvent(request, 'success').pipe(take(1), map(() => request.result));
  const error$: Observable<any> = fromEvent(request, 'error').pipe(take(1), switchMap(() => throwError(request.error)));

  return race(success$, error$);
}
