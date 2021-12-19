import {Injectable} from '@angular/core';
import {fromEvent, map, Observable, take, tap} from 'rxjs';

import {MidiRecord, midiRecordSortFn} from '../midi/midi-record';

import {waitForIdbRequestResult} from './wait-for-idb-request-result';

@Injectable({
  providedIn: 'root',
})
export class MidiRecordsDb {

  private static DB_NAME: string = 'webpiano';

  private static DB_STORE_NAME: string = 'midi-records';

  private _db: IDBDatabase;

  getAll(): Observable<MidiRecord[]> {
    return waitForIdbRequestResult<MidiRecord[]>(this._getStore().getAll()).pipe(
      map(records => records.sort(midiRecordSortFn)),
    );
  }

  add(record: MidiRecord): Observable<IDBValidKey> {
    return waitForIdbRequestResult(this._getStore().add(record));
  }

  remove(record: MidiRecord): Observable<void> {
    return waitForIdbRequestResult(this._getStore().delete(record.title));
  }

  clear(): Observable<void> {
    return waitForIdbRequestResult(this._getStore().clear());
  }

  init(): Observable<IDBDatabase> {
    const openDbRequest: IDBOpenDBRequest = indexedDB.open(MidiRecordsDb.DB_NAME, 1);
    const db$: Observable<IDBDatabase> = waitForIdbRequestResult(openDbRequest);

    fromEvent(openDbRequest, 'upgradeneeded').pipe(take(1)).subscribe(() => {
      openDbRequest.result.createObjectStore('midi-records', {keyPath: 'title'});
    });

    return db$.pipe(tap(db => this._db = db));
  }

  private _getStore(): IDBObjectStore {
    const transaction: IDBTransaction = this._db.transaction(MidiRecordsDb.DB_STORE_NAME, 'readwrite');
    return transaction.objectStore(MidiRecordsDb.DB_STORE_NAME);
  }
}
