import {
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {
  finalize,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  Book,
  Country,
  fireBookBody,
} from '../catalogue.model';
import {
  FetchDataApi,
  FireCollectionApiService,
} from '../services/index';
import {
  TIME_TO_READ,
  WhenToReadSelect,
} from '../catalogue.model';
import { LoadingService } from 'src/app/services/loading.service';
import { FlagInfoService } from '../services/index';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent
  implements OnInit, AfterViewInit
{
  bookData$: Observable<Book>;
  fireData$: Observable<fireBookBody>;

  check = faCheck;
  ban = faBan;

  get whenToRead(): WhenToReadSelect[] {
    return TIME_TO_READ;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private fireApiService: FireCollectionApiService,
    private router: Router,
    private fetchDataApi: FetchDataApi,
    private loadingService: LoadingService,
    private flagInfo: FlagInfoService
  ) {}

  id = this.activatedRoute.snapshot.params['id'];

  goBack() {
    this.router.navigate(['catalogue']);
  }

  initBookDetail(): Observable<Book> {
    return this.fireApiService
      .getBookData(this.id)
      .pipe(
        finalize(() =>
          this.loadingService.stop()
        ),
        tap(
          (fireValue) =>
            (this.fireData$ = of(fireValue))
        ),
        switchMap((fireData) => {
          return this.fetchDataApi.getBooksFromApi(
            fireData.title
          );
        })
      );
  }

  ngOnInit(): void {
    this.bookData$ = this.initBookDetail();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadingService.start();
    }, 0);
  }

  getCountryFlag(country: Country) {
    return this.flagInfo.getCountryFlag(country);
  }

  getCountryPopulation(country: Country) {
    return this.flagInfo.getCountryPopulation(
      country
    );
  }
}

// initBookDetail(): Observable<Book> {

//   return this.fireApiService.getBookData(this.id)
//     .pipe(tap(fireValue => this.fireData$ = of(fireValue)), switchMap(fireData => {
//       return this.bookApiService.getBookByName(fireData.title)
//         .pipe(switchMap(bookData => {
//           const book = bookData.items[0].volumeInfo;
//           return this.bookApiService.getFilmByName(book.title)
//             .pipe(switchMap(filmData => {
//               if (filmData.Response == "True") {
//                 const countries = filmData.Country.split(", ");
//                 return forkJoin(countries.map(c => this.bookApiService.getCountryByCode(c)
//                   .pipe(map<CountryApiResult, Country>(countryData => {
//                     return {
//                       code: countryData.alpha2Code,
//                       population: countryData.population
//                     }
//                   }),
//                     catchError(err => of(null))))).pipe(
//                       map<Country[], Book>(cData => {
//                         return this.mapBook(cData, bookData, filmData)
//                       })
//                     )

//               }
//               else {
//                 return of(this.mapBook(null, bookData, filmData))
//               }
//             }))
//         }))
//     })).pipe(tap(x => console.log(x)))
// }
