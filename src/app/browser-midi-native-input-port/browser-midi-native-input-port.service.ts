import {DOCUMENT} from '@angular/common';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {filter, fromEvent, map, noop, Observable, Subscription} from 'rxjs';
import {BROWSER_MIDI_NATIVE_INPUT_KEY_CODES} from './browser-midi-native-input-key-codes';
import {BrowserNativeMidiPort} from '../browser-midi-native-port/browser-native-midi-port';

@Injectable({
  providedIn: 'root',
})
export class BrowserMidiNativeInputPort extends BrowserNativeMidiPort implements OnDestroy {

  private readonly _document: Document;

  private _noteOnSubscription: Subscription = Subscription.EMPTY;

  private _noteOffSubscription: Subscription = Subscription.EMPTY;

  private _sustainOnSubscription: Subscription = Subscription.EMPTY;

  private _sustainOffSubscription: Subscription = Subscription.EMPTY;

  readonly name: string = 'Host Keyboard';

  readonly type: 'input' = 'input';

  constructor(@Inject(DOCUMENT) _document: any) {
    super();
    this._document = _document;
  }

  ngOnDestroy(): void {
    this._unbindDocumentKeyboardEvents();
  }

  override addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    super.addEventListener(type, listener);

    if (type === 'midimessage' && this._listeners[type].size === 1) {
      this._bindDocumentKeyboardEvents();
    }
  }

  override removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null): void {
    super.removeEventListener(type, listener);

    if (type === 'midimessage' && this._listeners[type].size === 0) {
      this._unbindDocumentKeyboardEvents();
    }
  }

  private _bindDocumentKeyboardEvents(): void {
    const documentKeydown$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(this._document, 'keydown').pipe(
      filter(({repeat}) => !repeat),
    );
    const documentKeyup$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(this._document, 'keyup');
    const dispatcher: (_: WebMidi.MIDIMessageEvent) => void = (event: WebMidi.MIDIMessageEvent) => {
      this.dispatchEvent(event);
    };

    this._noteOnSubscription = documentKeydown$.pipe(
      filter(({code}) => BROWSER_MIDI_NATIVE_INPUT_KEY_CODES[code] !== undefined),
      map(({code}) => ({type: 'midimessage', data: new Uint8Array([0x90, BROWSER_MIDI_NATIVE_INPUT_KEY_CODES[code], 0x40])})),
    ).subscribe(dispatcher);

    this._noteOffSubscription = documentKeyup$.pipe(
      filter(({code}) => BROWSER_MIDI_NATIVE_INPUT_KEY_CODES[code] !== undefined),
      map(({code}) => ({type: 'midimessage', data: new Uint8Array([0x90, BROWSER_MIDI_NATIVE_INPUT_KEY_CODES[code], 0x00])})),
    ).subscribe(dispatcher);

    this._sustainOnSubscription = documentKeydown$.pipe(
      filter(({code}) => code === 'Space'),
      map(({code}) => ({type: 'midimessage', data: new Uint8Array([0xB0, 0x40, 0x7F])})),
    ).subscribe(dispatcher);

    this._sustainOffSubscription = documentKeyup$.pipe(
      filter(({code}) => code === 'Space'),
      map(({code}) => ({type: 'midimessage', data: new Uint8Array([0xB0, 0x40, 0x00])})),
    ).subscribe(dispatcher);
  }

  private _unbindDocumentKeyboardEvents(): void {
    this._noteOnSubscription.unsubscribe();
    this._noteOffSubscription.unsubscribe();
    this._sustainOnSubscription.unsubscribe();
    this._sustainOffSubscription.unsubscribe();
  }
}
