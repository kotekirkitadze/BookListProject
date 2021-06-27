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
// რადგან შიგნით დაჭირდება რომ ვალიდაცია გაატაროს.
// და ალიდატორ რომ არ იყოს დაიმპლემენტირებული,
// validate ფუნქციიის ამოგდების შემთხვევაში, ერორი იქნება.
// ასე რომ ქასთომ ვალიდატორი რომ იყოს ეს MustMatchDirective დირექტივა,
// უეჭველი უნდა აიმპლემენტირებდეს Validator - ს და validate არის
// ზუსტად ის ფუნქცია, რაც წეღან დავწერეთ ქასთომ ვალიდატორად რეაქტიულ ფორმებში,
// უბრალოდ ვალიდატორის ფუნქცია ცალკე გვაქვს გატანილი mustMatch ფუნქციად,
// რათა აქ სუფთად იყოს ამ დირექტივის ფაილი.
// mustMatch - ს ფორმ გრუპს ვაწვდით, რომ ფორმ გრუპზე გვქონდეს წვდომა.


export class MustMatchDirective implements Validator {
  @Input('mustMatch') mustMatch: string[] = [];

  validate(formGroup: FormGroup): ValidatorFn {
    //აქ მასთ მეჩი ცალკე არის გატანილი, რომ ირექტივა სუფთად იყოს,
    //თორემ აქვე დაწერაც შეგვეძლო ამ ფუნქციის.
    return mustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup);
  }
}
