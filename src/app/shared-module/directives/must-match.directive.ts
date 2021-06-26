import { Directive, Input } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { mustMatch } from '../utils/validators.fn';

@Directive({
  selector: '[mustMatch]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: MustMatchDirective, multi: true },
  ],
})

//ეს დირექტივა რომ თემფლეით დრივენ ფორმის არის, 
//აქ გამოიხატება პროვაიდერებით.
// NG_VALIDATORS ტოკენი პროვაიდდება, რომელიც არის შემოიმპორტებული 
// @angular/forms - დან.
// useExisting ნიშნავ იმას, რომ ამ ტოკენის ვალიდატორად გამოიყენებს
// MustMatchDirective - ს.

// NG_VALIDATORS ტოკენი უზრუნველყოფს იმას, რომ ეს მართლა ვალიდატორი იყოს.
// implements Validator იც იმას უზრუნველყოფს, 
// //რომ validate(formGroup: FormGroup): ValidatorFn ფუნქცია გვქონდეს.
// //NG_VALIDATORS ითხოვს რომ MustMatchDirective - ს ქონდეს validate ფუნქცია.

export class MustMatchDirective implements Validator {
  @Input('mustMatch') mustMatch: string[] = [];

  validate(formGroup: FormGroup): ValidatorFn {
      //აქ მასთ მეჩი ცალკე არის გატანილი, რომ ირექტივა სუფთად იყოს,
      //თორემ აქვე დაწერაც შეგვეძლო ამ ფუნქციის.
    return mustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup);
  }
}
