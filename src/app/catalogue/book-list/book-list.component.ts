import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { Book, ListData } from '../catalogue.model';
import { AddBookService, FireCollectionApiService } from '../services';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, AfterViewInit {

  constructor(private bookFireServie: FireCollectionApiService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private addBookService: AddBookService,
    private loadingService: LoadingService) { }

  books$: Observable<ListData[]> = null;


  ngOnInit() {
    this.books$ = this.fetch();
  }


  fetch(): Observable<ListData[]> {
    return this.bookFireServie.getBooksData().pipe(
      finalize(() => this.loadingService.stop()),
      switchMap(fireData => {
        return forkJoin(fireData.map(eachfireData => this.addBookService.getBooksFromApi(eachfireData.title)
          .pipe(map<Book, ListData>(wholeData => {
            return {
              fireData: eachfireData,
              allData: wholeData
            }
          }))
        ))
      })

    )
  }

  deleteBook(id: string) {
    this.loadingService.start();
    this.bookFireServie.deleteBook(id).subscribe(() => {
      this.books$ = this.fetch().pipe(finalize(() => this.loadingService.stop()))
      this.translateService.get("catalogue.DELETE_BOOK").subscribe(value => this.toastr.success(value))
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadingService.start();
    }, 0)
  }
}






// fetch() {
//   return this.AllDataApiService.getBooksData().pipe(
//     switchMap(fireData => {
//       return forkJoin(fireData.map(eachData => this.bookApiService.getBookByName(eachData.title).pipe(
//         switchMap(eachBook => {
//           const book = eachBook.items[0].volumeInfo;
//           return this.bookApiService.getFilmByName(book.title).pipe(
//             switchMap(filmData => {
//               if (filmData.Response == "True") {
//                 const countries = filmData.Country.split(", ")
//                 return forkJoin(countries.map(c => {
//                   return this.bookApiService.getCountryByCode(c).pipe(
//                     map(countryApi => {
//                       return {
//                         code: countryApi.alpha2Code,
//                         poppulation: countryApi.population
//                       }
//                     }),
//                     catchError(() => of(null))
//                   )
//                 })).pipe(map(countries => {
//                   return {
//                     countries: countries,
//                     ApiBook: book,
//                     fireData: eachData,
//                     filmData
//                   }
//                 }))
//               } else {
//                 return of({
//                   country: null,
//                   ApiBook: book,
//                   fireData: eachData,
//                   filmData: null
//                 })
//               }
//             }),
//           )
//         })
//       )))
//     })

//   )
// }
