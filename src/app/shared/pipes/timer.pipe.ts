// timer.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;

    const mm = minutes < 10 ? '0' + minutes : minutes.toString();
    const ss = seconds < 10 ? '0' + seconds : seconds.toString();

    return `${mm}:${ss}`;
  }
}
