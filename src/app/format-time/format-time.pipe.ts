import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {

  transform(timeInMs: number): any {
    const mm: string = `${Math.floor(timeInMs / 60_000)}`.padStart(2, '0');
    const ss: string = `${Math.floor((timeInMs % 60_000) / 1000)}`.padStart(2, '0');

    return `${mm}:${ss}`;
  }
}
