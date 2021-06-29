import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { finalize, takeUntil, map, switchMap } from 'rxjs/operators';
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
  CountryApiResult
} from '../catalogue.model';
import { forkJoin, Subject } from 'rxjs';


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



  get timeToRead(): WhenToReadSelect[] {
    return TIME_TO_READ;
  }

  submit() {
    this.submitted = true;
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

  getBooksFromApi(name: string) {
    this.loadingService.start();
    this.apiService.getBookByName(name).pipe(
      finalize(() => {
        this.loadingService.stop();
        this.searchData = "";
      }),
      map(data => data?.items[0].volumeInfo),
      switchMap(data => {
        const title = data.title;
        this.apiService.getFilmByName(title).subscribe(data => {
          if (data.Response == "True") {
            const countries = data.Country.split(', ');
            forkJoin(countries.map((countryCode) => this.apiService.getCountryByCode(countryCode))).pipe(
              map<CountryApiResult[], Country[]>((element) => {
                return element.map(el => {
                  return {
                    code: el.alpha2Code,
                    population: el.population,
                  }
                })


              })
            ).subscribe(data => console.log(data));



            // this.apiService.getCountryByCode(countries[0]).pipe();

          }

        });
        return data.authors
      })


    ).subscribe((x) => console.log(x))
  }

  constructor(private loadingService: LoadingService,
    private apiService: BookApiService,
    private storage: StorageService) { }


  restoreSearches() {
    const searchesInStorage = this.storage.get<string[]>("lastThreSearches");
    if (searchesInStorage?.length > 0) {
      this.lastThreeSearches = searchesInStorage;
    }
  }

  createForm() {
    this.form = new FormGroup({
      rating: new FormControl(3),
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


  private _selectedBook: Book;

}
