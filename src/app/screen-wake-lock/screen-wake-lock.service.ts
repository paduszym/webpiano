import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScreenWakeLock {

  private _sentinel: WakeLockSentinel;

  async acquire(): Promise<void> {
    if (!this._sentinel && navigator.wakeLock) {
      this._sentinel = await navigator.wakeLock.request('screen');
    }
  }

  async release(): Promise<void> {
    if (this._sentinel) {
      await this._sentinel.release();
      this._sentinel = null;
    }
  }
}
