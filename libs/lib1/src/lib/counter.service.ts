import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CounterService {
  private value = 0;

  increment(): void {
    this.value++;
  }

  decrement(): void {
    this.value--;
  }

  getValue(): number {
    return this.value;
  }

  reset(): void {
    this.value = 0;
  }
}
