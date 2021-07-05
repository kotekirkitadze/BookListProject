import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, pipe } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Book, BookApiResult, Country, CountryApiResult, fireBookBody, MovieApiResult } from '../catalogue.model';
import { BookApiService, FireApiService } from '../services';
import { TIME_TO_READ, WhenToReadSelect } from '../catalogue.model'

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {

  a: WhenToReadSelect[] = TIME_TO_READ;

  bookData$: Observable<Book>;
  fireData$: Observable<fireBookBody>;

  constructor(private activatedRoute: ActivatedRoute,
    private fireApiService: FireApiService,
    private bookApiService: BookApiService,
    private router: Router) { }


  id = this.activatedRoute.snapshot.params['id'];
  // /Country[], book: BookApiResult, movie: MovieApiResult): Book
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
  // .subscribe(x => console.log(x))
  goBack() {
    this.router.navigate(["catalogue"]);
  }
  initBookDetail(): Observable<Book> {

    return this.fireApiService.getBookData(this.id)
      .pipe(tap(fireValue => this.fireData$ = of(fireValue)), switchMap(fireData => {
        return this.bookApiService.getBookByName(fireData.title)
          .pipe(switchMap(bookData => {
            const book = bookData.items[0].volumeInfo;
            return this.bookApiService.getFilmByName(book.title)
              .pipe(switchMap(filmData => {
                if (filmData.Response == "True") {
                  const countries = filmData.Country.split(", ");
                  return forkJoin(countries.map(c => this.bookApiService.getCountryByCode(c)
                    .pipe(map<CountryApiResult, Country>(countryData => {
                      return {
                        code: countryData.alpha2Code,
                        population: countryData.population
                      }
                    }),
                      catchError(err => of(null))))).pipe(
                        map<Country[], Book>(cData => {
                          return this.mapBook(cData, bookData, filmData)
                        })
                      )

                }
                else {
                  return of(this.mapBook(null, bookData, filmData))
                }
              }))
          }))
      })).pipe(tap(x => console.log(x)))
  }


  ngOnInit(): void {
    this.bookData$ = this.initBookDetail()
  }

}




// initBookDetail() {
  //   const id = this.activatedRoute.snapshot.params['id'];
  //   return this.fireApiService.getBookData(id)
  //     .pipe(switchMap(fireData => {
  //       return forkJoin(this.bookApiService.getBookByName(fireData.title)
  //         .pipe(switchMap(bookData => {
  //           const book = bookData.items[0].volumeInfo;
  //           return forkJoin(this.bookApiService.getFilmByName(book.title)
  //             .pipe(switchMap(filmData => {
  //               if (filmData.Response == "True") {
  //                 const countries = filmData.Country.split(", ");
  //                 return forkJoin(countries.map(c => this.bookApiService.getCountryByCode(c)
  //                   .pipe(
  //                     map<CountryApiResult, Country>(country => {
  //                       return {
  //                         code: country.alpha2Code,
  //                         population: country.population
  //                       }
  //                     }),
  //                     catchError(err => of(null)))))
  //                   .pipe(map<Country[], Book>(countryData => {
  //                     return this.mapBook(countryData, bookData, filmData)
  //                   }))
  //               } else {
  //                 return of(this.mapBook(null, bookData, filmData))
  //               }
  //             })))
  //         })))
  //     }))
  // }




