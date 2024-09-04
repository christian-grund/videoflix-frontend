import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private emailSource = new BehaviorSubject<string>('');
  currentEmail = this.emailSource.asObservable();

  constructor() {}

  changeEmail(email: string) {
    this.emailSource.next(email);
  }
}
