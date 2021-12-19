import {noop} from 'rxjs';

export abstract class BrowserNativeMidiPort implements Partial<WebMidi.MIDIPort> {

  protected _listeners: Record<string, Set<EventListenerOrEventListenerObject>> = {};

  readonly manufacturer: string = 'Webpiano';

  readonly version: string = '1.0.0';

  readonly id: string = null;

  readonly connection: WebMidi.MIDIPortConnectionState = 'open';

  readonly state: WebMidi.MIDIPortDeviceState = 'connected';

  readonly onstatechange: () => void = noop;

  abstract readonly name: string;

  abstract readonly type: WebMidi.MIDIPortType;

  async open(): Promise<WebMidi.MIDIPort> {
    return this;
  }

  async close(): Promise<WebMidi.MIDIPort> {
    return this;
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    this._listeners[type] = this._listeners[type] || new Set();
    this._listeners[type].add(listener);
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
    this._listeners[type].delete(listener);
  }

  dispatchEvent(event: Event): boolean {
    for (const listener of this._listeners[event.type]) {
      if (typeof listener === 'function') {
        listener(event);
      } else {
        listener.handleEvent(event);
      }
    }
    return true;
  }
}
