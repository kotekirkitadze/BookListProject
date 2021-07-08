import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { Book, ListData } from '../catalogue.model';
import { AddBookService, BookApiService, FireCollectionApiService } from '../services';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {

  constructor(private bookFireServie: FireCollectionApiService,
    private bookApiService: BookApiService,
    private afs: AngularFirestore,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private addBookService: AddBookService,
    private loadingService: LoadingService) { }

  //ახლა ასნიკ პაიპით გადავყევით, მაგრამ ამის ალტერნატივა იქნებოდა
  // აქ ფირებუქის ტიპის ერეის ცვლადი შეგვექმნა და ენჯიონინიტში
  // this.bookFireServie.getBookData() - ს დავსაბსქრაიბებოდით
  // და მოცემული მნიშვნელობა ამ ცვლადისთვის მიგვემაგრებინა.
  // შემდეგ ენჯიფორით გადავყოლოდით ამ ცვლადს html - ში.
  // მაგრამა ასე ასინკ პაიპით გაკეთება უფრო კარგი პრაქტიკააო.
  // რადგან უფრო ნაკლები ბაგი იქნებაო, ტიესში დასაბსქრაიბებით კი შეიძლება
  // რაღაც ავრიოთ. აქ ასინკებით კი ვერაფერს გავაფუჭებთ. უბრალოდ სტრიმი უნდა
  // იყოს სწორი.
  //და თუ გვინდა რაღაც საიდ ეფექტები გვქონდეს, რეალურად, მაგალითად ტოასტის გამოყვანა
  // და ასე შემდეგ, აქვე შეგვიძლია საიდ ეფეტქებისთვის ტაპების გამოყენება პაიპში,
  // საბსქრაიბებში რომ არ ვქნათ ტიესშივე თვითონ:
  // // this.bookFireServie.getBookData().pipe(tap(()=>{........}))
  // და ასე ტაპის გამოყენება კარგი პრაქტიკა არისო, რადგან ხელით არ ვუსაბსქრაიბდებითო.
  // პ.ს.თუ ამ დათას რაღაც გვინდა ვუქნათ, მივწრათ მოვჭრათ და რამე, მაშინ ცვლადზე მიმაგრება
  // შეიძლება და გასაგებიცაა ალბათ.მაგრამ თუ გვინდა რომ უბრალოდ ვაჩვენოთ დატა როგორც აქ,
  // მაშინ ჯობია ასინკები გამოვიყენოთ.
  //პ.ს. async as რაღაც - მთლიანად კოლექციაზე მიუთითებს - საბსქრაიბში შემოსულ ველიუზე.
  books$: Observable<ListData[]> = null; //this.bookFireServie.getBookData();



  ngOnInit() {
    this.books$ = this.fetch()
    // this.fetch().subscribe(x => console.log(x))
  }

  // სვიჩმეპიდ და ფორქ ჯოინი იმიტომ გვინდა აქ, რომ
  // სვიჩმეპი წინა ობზერვებლს გვირეზოლვებს, გვაძლევს დატას და
  // ამ დატებით ფორკჯოინში ვარექვესთებთ რაღაცეებს.
  // ხომ ვინდა რომ წინა ობზერვებლი დავარეზოლვოთ რაღაცეები - ამას
  // კი სვიჩმეპით ვაკეთებთ და გადავდივართ ახალ ობზერვებლზეც, თუ გვინდა.

  // Observable<ListData>

  //გასატიპიზიირებელია
  //ასევე მეთვრამეტე ლექციის 1:25 წუთზე შეგიძლია აიდის დამატების მომენტი ნახო.
  fetch(): Observable<ListData[]> {
    this.loadingService.start();
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
    this.bookFireServie.deleteBook(id).subscribe(() => {
      this.books$ = this.fetch()
      this.translateService.get("catalogue.DELETE_BOOK").subscribe(value => this.toastr.success(value))
    });
  }

}






// fetch() {
//   return this.bookFireServie.getBooksData().pipe(
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
