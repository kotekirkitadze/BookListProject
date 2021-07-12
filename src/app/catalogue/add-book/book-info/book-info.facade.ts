import { Injectable } from "@angular/core";
import { Status, fireBookBody, Country } from '../../catalogue.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { FireCollectionApiService } from "../../services";
import { finalize } from "rxjs/operators";

@Injectable()
export class BookInfoFacade {

  constructor(private translateService: TranslateService,
    private toastr: ToastrService,
    private currentUser: AuthService,
    private store: FireCollectionApiService) { }

  form: FormGroup;
  submitted: boolean = false;

  createForm() {
    this.form = new FormGroup({
      rating: new FormControl(1),
      review: new FormControl('', [Validators.required,
      Validators.minLength(10)]),
      status: new FormControl(Status.Read)
    });
  }

  addControlByStatus(status: Status) {
    switch (status) {
      case Status.ReadLater:
        this.form.addControl(
          "whenToRead",
          new FormControl(null, Validators.required)
        );
        break;
      case Status.Read:
        this.form.removeControl('whenToRead');
        break;
    }
  }

  private resetForm() {
    this.translateService.get("catalogue.TOASTR_BOOK_ADDED").subscribe(value => this.toastr.success(value));

    this.form.reset();
    this.form.updateValueAndValidity();
    this.submitted = false;
    this.form.get("status").setValue(Status.Read);
    this.form.get("rating").setValue(1);

  }

  submit(title: string) {
    this.submitted = true;
    if (this.form.invalid) {
      return null;
    }

    const formValue = this.form?.value;

    const fireBody: fireBookBody = {
      title: title,
      rating: formValue?.rating,
      review: formValue?.review,
      status: formValue?.status,
      whenToRead: formValue?.whenToRead ? formValue.whenToRead : null,
      uid: this.currentUser.getCurrentUser().uid
    }


    return this.store.postBookData(fireBody).pipe(finalize(() => {
      this.resetForm();
    }));

  }


  getCountryFlag(country: Country) {
    return `https://www.countryflags.io/${country.code}/shiny/64.png`
  }

  getCountryPopulation(country: Country) {
    return `Population of ${country.code}: ${country.population}`;
  }
}
