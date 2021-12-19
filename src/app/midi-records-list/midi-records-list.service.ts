import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, shareReplay, startWith, Subject, switchMap, tap} from 'rxjs';

import {MidiRecord} from '../midi/midi-record';
import {MidiTimedEvent} from '../midi/midi-timed-event';

import {MidiRecordsDb} from '../midi-records-db/midi-records-db.service';

@Injectable({
  providedIn: 'root',
})
export class MidiRecordsList {

  private _fetchItemsFromDb$: Subject<void> = new Subject();

  private _items$: Observable<MidiRecord[]> = this._fetchItemsFromDb$.pipe(
    startWith(null),
    switchMap(() => this._db.getAll()),
    shareReplay(1),
  );

  readonly latestRecord$: Observable<MidiRecord> = this._items$.pipe(
    map(([latestRecord]) => latestRecord),
    shareReplay(1),
  );

  readonly notEmpty$: Observable<boolean> = this._items$.pipe(
    map(({length}) => length > 0),
    shareReplay(1),
  );

  get items$(): Observable<MidiRecord[]> {
    return this._items$;
  }

  constructor(private _db: MidiRecordsDb) {
  }

  add(title: string, events: MidiTimedEvent[]): Observable<IDBValidKey> {
    return this._db.add({title, date: new Date(), events}).pipe(
      tap(() => this._fetchItemsFromDb()),
    );
  }

  remove(record: MidiRecord): Observable<void> {
    return this._db.remove(record).pipe(
      tap(() => this._fetchItemsFromDb()),
    );
  }

  clear(): Observable<void> {
    return this._db.clear().pipe(
      tap(() => this._fetchItemsFromDb()),
    );
  }

  private _fetchItemsFromDb(): void {
    this._fetchItemsFromDb$.next();
  }
}
