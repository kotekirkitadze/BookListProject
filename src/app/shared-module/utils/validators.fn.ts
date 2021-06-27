import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function mustMatch(controlName: string, matchingControlName: string) {
  // რახან ეს მთლიანად ფუნქციას აბრუნებს, ყოველთვის შეუძლია
  // ეს ფუნქცია თავიდან გამოიძახოს.
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    // თუ ერთ-ერთი მაინც არ არსებობს, ვაბრუნებთ ნალს, ანუ ყველაფერი
    // რიგზეა და ერორი არ არის.
    // return null if controls haven't initialised yet
    if (!control || !matchingControl) {
      return null;
    }

    // პ.ს. თუ ნალს ვაბრუნებთ, ყველაფერი რიგზეაო.
    // return null if another validator has already found an error on the matchingControl
    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return null;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
      //აქ შეგვეძლო პირდაპირ ობიექტი დაგვებრუნებია რამე ერორად,
      // მაგრამ პირდაპირ რიფით ფასვორდ ერორებში ვუსეტავთ serError - ით.
    } else {
      matchingControl.setErrors(null);
    }
  };
}
