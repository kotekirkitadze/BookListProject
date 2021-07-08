import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, pipe } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Book, BookApiResult, Country, CountryApiResult, fireBookBody, MovieApiResult } from '../catalogue.model';
import { AddBookService, BookApiService, FireCollectionApiService } from '../services';
import { TIME_TO_READ, WhenToReadSelect } from '../catalogue.model'

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  bookData$: Observable<Book>;
  fireData$: Observable<fireBookBody>;

  get whenToRead(): WhenToReadSelect[] {
    return TIME_TO_READ;
  }

  constructor(private activatedRoute: ActivatedRoute,
    private fireApiService: FireCollectionApiService,
    private router: Router,
    private addBookService: AddBookService) { }

  id = this.activatedRoute.snapshot.params['id'];

  goBack() {
    this.router.navigate(["catalogue"]);
  }

  initBookDetail(): Observable<Book> {
    return this.fireApiService.getBookData(this.id)
      .pipe(tap(fireValue => this.fireData$ = of(fireValue)), switchMap(fireData => {
        return this.addBookService.getBooksFromApi(fireData.title);
      }))

  }

  ngOnInit(): void {
    this.bookData$ = this.initBookDetail()
  }


  getCountryFlag(country: Country) {
    return `https://www.countryflags.io/${country.code}/shiny/64.png`
  }

  getCountryPopulation(country: Country) {
    return `Population of ${country.code}: ${country.population}`;
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
