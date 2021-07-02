import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { finalize, takeUntil, map, switchMap, catchError } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { BookApiService } from '../services/book-api.services';
import { faStar } from '@fortawesome/free-solid-svg-icons';
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
} from '../catalogue.model';
import { forkJoin, of, Subject } from 'rxjs';
import { SaveDataService } from 'src/app/services/save-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FireApiService } from '../services';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit, OnDestroy {

  starRating = faStar;
  searchData: string;
  errorVal: boolean;
  lastThreeSearches: string[] = [];
  form: FormGroup;
  status = Status;
  fb: FormBuilder;
  submitted: boolean = false;

  private unsubscribe$ = new Subject();

  private _selectedBook: Book;

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
      uid: this.currentUser.getUserUid()
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

  get whenToRead(): boolean {
    return !!this.form.get('whenToRead');
  }

  pushInlastSearches(name: string) {
    if (this.lastThreeSearches.length < 3) {
      this.lastThreeSearches.unshift(name);
      this.storage.set<string[]>("lastThreSearches", this.lastThreeSearches);
      return;
    }

    this.lastThreeSearches.splice(2, 1);
    this.lastThreeSearches.unshift(name);
    this.storage.set<string[]>("lastThreSearches", this.lastThreeSearches);
  }

  searchBook(key: string) {
    if (!key || key == " ") {
      this.errorVal = true;
      return;
    }
    this.errorVal = false;

    this.pushInlastSearches(key);
    this.getBooksFromApi(key);

  }


  mapToMovie(filmData: MovieApiResult, bookData: BookApiResult) {
    if (filmData.Response == "True") {
      const countries = filmData.Country.split(', ');
      return forkJoin(countries.map((countryCode) => this.apiService.getCountryByCode(countryCode))).pipe(
        map<CountryApiResult[], Country[]>((element) => {
          return element.map(el => {
            return {
              code: el.alpha2Code,
              population: el.population,
            }
          })
        }),
        catchError((err) => of(null)),
        map<Country[], Book>(countryData => {
          return this.mapBook(countryData, bookData, filmData);
        })
      )
    } else {
      return of(this.mapBook(null, bookData, null));
    }
  }


  getBooksFromApi(name: string) {
    this.loadingService.start();
    this.apiService.getBookByName(name).pipe(
      finalize(() => {
        this.loadingService.stop();
        this.searchData = "";
      }),
      //map(bookData => bookData?.items[0].volumeInfo),
      switchMap((bookData) => {
        const bookInfo = bookData?.items[0]?.volumeInfo
        const title = bookInfo.title;
        return this.apiService.getFilmByName(title).pipe(
          switchMap((filmData) => this.mapToMovie(filmData, bookData))
        )
      }),
      catchError(err => {
        return of(null)
      })
    ).subscribe((selectedBook) => {
      this._selectedBook = selectedBook;
      //console.log(selectedBook)
    });
  }

  mapBook(countries: Country[], book: BookApiResult, movie: MovieApiResult): Book {
    return {
      title: book?.items[0].volumeInfo?.title,
      authors: book?.items[0].volumeInfo?.authors[0],
      categories: book?.items[0].volumeInfo?.categories[0],
      description: book?.items[0].volumeInfo?.description,
      publishedDate: book?.items[0].volumeInfo?.publishedDate,
      publisher: book?.items[0].volumeInfo?.publisher,
      imageLinks: book?.items[0].volumeInfo?.imageLinks?.smallThumbnail,
      countries: countries?.map(el => el),
      movie: {
        released: movie?.Released,
        response: movie?.Response
      }
    }
  }


  constructor(private loadingService: LoadingService,
    private apiService: BookApiService,
    private storage: StorageService,
    private store: FireApiService,
    private currentUser: AuthService,
    private toastr: ToastrService,
    private translateService: TranslateService) { }


  restoreSearches() {
    const searchesInStorage = this.storage.get<string[]>("lastThreSearches");
    if (searchesInStorage?.length > 0) {
      this.lastThreeSearches = searchesInStorage;
    }
  }

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

  ngOnInit(): void {
    this.restoreSearches();
    this.createForm();

    this.form.get('status').valueChanges.pipe(takeUntil(this.unsubscribe$))
      //აქ ეროუ ფანქშენის გაერეშე ვერ გააყოლა ედდ კონტროლი, კონტექსტი ვერ შეგვინახა
      .subscribe((status) => this.addControlByStatus(status));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCountryFlag(country: Country) {
    return `https://www.countryflags.io/${country.code}/shiny/64.png`
  }
  getCountryPopulation(country: Country) {
    return `Population of ${country.code}: ${country.population}`;
  }
}
