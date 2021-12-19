import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {filter, Subscription} from 'rxjs';

import {MidiPort} from '../midi-port/midi-port';

@Component({
  selector: 'wpn-midi-port-select',
  templateUrl: './midi-port-select.component.html',
  styleUrls: ['./midi-port-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MidiPortSelectComponent<T extends MidiPort = MidiPort> implements OnChanges, OnDestroy {

  _portId: string = null;

  _portDeviceStateSubscription: Subscription = Subscription.EMPTY;

  @Input()
  label: string;

  @Input()
  disabled: boolean = false;

  @Input()
  ports: T[] = [];

  @Input()
  port: T;

  @Output()
  readonly portChange: EventEmitter<T> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['port']) {
      this._portChanged();
    }
  }

  ngOnDestroy(): void {
    this._portDeviceStateSubscription.unsubscribe();
  }

  _emitValue(newPortId: string): void {
    this._portId = newPortId || null;
    this.port = this._getPortFromList(newPortId);
    this.portChange.emit(this.port);
  }

  private _portChanged(): void {
    const port: T = this.port ? this._getPortFromList(this.port.id) : null;

    this._portDeviceStateSubscription.unsubscribe();

    if (port) {
      this._portId = port.id;
      this._portDeviceStateSubscription = port.deviceState$.pipe(
        filter(deviceState => deviceState === 'disconnected'),
      ).subscribe(() => this._emitValue(null));
    } else {
      this._portId = null;
    }
  }

  private _getPortFromList(portId: string): T {
    return this.ports.find(({id}) => portId === id) || null;
  }
}
