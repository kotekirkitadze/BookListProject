import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { BookApiService, FireCollectionApiService } from '../../services';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  Book,
  Status,
  TIME_TO_READ,
  WhenToReadSelect,
  Country,
  CountryApiResult,
  BookApiResult,
  MovieApiResult,
  fireBookBody
} from '../../catalogue.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.scss']
})
export class BookInfoComponent implements OnInit, OnDestroy {

  @Input() _selectedBook: Book;

  constructor(private loadingService: LoadingService,
    private apiService: BookApiService,
    private storage: StorageService,
    private store: FireCollectionApiService,
    private currentUser: AuthService,
    private toastr: ToastrService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.createForm();

    this.form.get('status').valueChanges.pipe(takeUntil(this.unsubscribe$))
      //აქ ეროუ ფანქშენის გაერეშე ვერ გააყოლა ედდ კონტროლი, კონტექსტი ვერ შეგვინახა
      .subscribe((status) => this.addControlByStatus(status));
  }

  submitted: boolean = false;
  // private _selectedBook: Book;
  form: FormGroup;
  private unsubscribe$ = new Subject();

  check = faCheck;
  ban = faBan;
  status = Status;

  createForm() {
    this.form = new FormGroup({
      rating: new FormControl(1),
      review: new FormControl('', [Validators.required,
      Validators.minLength(10)]),
      status: new FormControl(Status.Read)
    });
  }


  private addControlByStatus(status: Status) {
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

  get getSelectedBook(): Book {
    return this._selectedBook;
  }

  get timeToRead(): WhenToReadSelect[] {
    return TIME_TO_READ;
  }


  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.value;

    const fireBody: fireBookBody = {
      title: this._selectedBook.title,
      rating: formValue.rating,
      review: formValue.review,
      status: formValue.status,
      whenToRead: formValue.whenToRead ? formValue.whenToRead : null,
      uid: this.currentUser.getCurrentUser().uid
    }

    //loading da addeed ragahc is axali dasamatebelia
    //promisi iqneba es
    this.store.postBookData(fireBody).subscribe(() => {
      this.resetForm();
    });

  }

  private resetForm() {
    this.translateService.get("catalogue.TOASTR_BOOK_ADDED").subscribe(value => this.toastr.success(value));
    //ფორმის ველიუს არესეტებს
    this.form.reset();
    this._selectedBook = null;
    this.form.updateValueAndValidity();
    this.submitted = false;

    //ფორმის დარესეტების შემდეგ, საწყისი ველიუები რომ დავუთაგოთ
    this.form.get("status").setValue(Status.Read);
    this.form.get("rating").setValue(1);

  }


  getCountryFlag(country: Country) {
    return `https://www.countryflags.io/${country.code}/shiny/64.png`
  }
  getCountryPopulation(country: Country) {
    return `Population of ${country.code}: ${country.population}`;
  }


  get whenToRead(): boolean {
    return !!this.form.get('whenToRead');
  }


  ngOnDestroy() {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
