import { Component, Input } from '@angular/core';
import { CounterService } from '../counter.service';

@Component({
  selector: 'tusk-cmp1',
  templateUrl: './cmp1.component.html',
  styleUrls: ['./cmp1.component.scss'],
})
export class Cmp1Component {
  @Input() appName = '';

  get value(): number {
    return this.counterService.getValue();
  }

  constructor(private readonly counterService: CounterService) {}

  increment(): void {
    this.counterService.increment();
  }

  decrement(): void {
    this.counterService.decrement();
  }

  reset(): void {
    this.counterService.reset();
  }
}
