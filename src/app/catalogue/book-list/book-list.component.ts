import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { Book, BookApiResult, Country, CountryApiResult, fireBookBody, MovieApiResult } from '../catalogue.model';
import { BookApiService, FireApiService } from '../services';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {

  constructor(private bookFireServie: FireApiService,
    private bookApiService: BookApiService) { }

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
  books$: Observable<fireBookBody[]> = null; //this.bookFireServie.getBookData();
  
  // switchMap(fireData => {
  //   return forkJoin(fireData.map(el => this.bookApiService.getFilmByName(el.title).pipe(
  //    switchMap(film =>{
  //      return this.bookApiService.getCountryByCode(film.Country).pipe(
  //        map(val => {
  //          return {
  //            country: {
  //              code: val.alpha2Code,
  //              population: val.population
  //            },
  //            film,
  //            el
  //          }
  //        }), catchError(err => of(el))
  //      )
  //    })
      
  //   )))
  // })



    ngOnInit() {
    const obs$ =  this.fetch();
    obs$.subscribe((x)=> console.log("hey", x))
      
    }


    fetch(){
      return this.bookFireServie.getBookData().pipe(
        switchMap(fireData => {
          return forkJoin(fireData.map(eachData => this.bookApiService.getBookByName(eachData.title).pipe(
            switchMap(eachBook => {
              const book = eachBook.items[0].volumeInfo;
              return this.bookApiService.getFilmByName(book.title).pipe(
                switchMap(filmData => {
                  if(filmData.Response == "True"){
                    const countries = filmData.Country.split(", ")
                    return forkJoin(countries.map(c => {
                      return this.bookApiService.getCountryByCode(c).pipe(
                        map(countryApi => {
                          return {
                            code: countryApi.alpha2Code,
                            poppulation: countryApi.population
                          }
                        })
                      )
                    })).pipe(map(countries => {
                      return {
                        countries: countries,
                        ApiBook: book,
                        fireData: eachData,
                        filmData
                      }
                    }))
                  } else {
                    return of({
                      country: null,
                      ApiBook: book,
                      fireData: eachData,
                      filmData: null
                    })
                  }
                }),  
              )
            })
          )))
        })
    
      )
    }



}


// return forkJoin(filmData.map(el => this.bookApiService.getCountryByCode(el.Country))).pipe(
//   map(value => value.map(country => {
//     return {
//       code: country.alpha2Code,
//       population: country.population
//     }
//   }))
// )

 


// this.bookFireServie.getBookData().pipe(
//   switchMap(fireData => {
//     return forkJoin(fireData.map(element => this.bookApiService.getBookByName(element.title))).pipe(
//       switchMap(bookData => {
//         return forkJoin(bookData.map(el => {
//           const book = el.items[0].volumeInfo
//           return this.bookApiService.getFilmByName(book.title)
//         })).pipe(
//           switchMap(filmData => filmData.map(el => {
//             if(el.Response == "True"){
//               return this.bookApiService.getCountryByCode(el.Country).pipe(
//                 map(el => {
//                   return {
//                     ...el,
//                     code: el.alpha2Code,
//                     population: el.population
//                   }
//                 })
//               )
//             } else {
//               return of(null)
//             }
//           })),
//           map(el => el.pipe(map(el => {
//             return {
//               bookData,
//               el,
//             }
//           })))
//         )

//       })
//     )

//   })
// ).subscribe(val => val.subscribe(val => console.log(val)));













//ერთ-ერთი ამოხსნა:

// ngOnInit(): void {
//   this.bookFireServie.getBookData().pipe(
//     map(fireData => {
//       return fireData.map(el=> this.getBooksFromApi(el.title).pipe(
//         map(val => {
//           return {
//             ...val,
//             fireData: el
//           }
//         })
//       ))
       
//     })
//   ).subscribe(el=> el.forEach(el=> el.subscribe(el=> console.log(el))))
// }





// getBooksFromApi(name: string) {
// return this.bookApiService.getBookByName(name).pipe(
//   finalize(() => {
//   }),
//   //map(bookData => bookData?.items[0].volumeInfo),
//   switchMap((bookData) => {
//     const bookInfo = bookData?.items[0]?.volumeInfo
//     const title = bookInfo.title;
//     return this.bookApiService.getFilmByName(title).pipe(
//       switchMap((filmData) => this.mapToMovie(filmData, bookData))
//     )
//   }),
//   catchError(err => {
//     return of(null)
//   }),
// )
// }




// mapToMovie(filmData: MovieApiResult, bookData: BookApiResult) {
// if (filmData.Response == "True") {
//   const countries = filmData.Country.split(', ');
//   return forkJoin(countries.map((countryCode) => this.bookApiService.getCountryByCode(countryCode))).pipe(
//     map<CountryApiResult[], Country[]>((element) => {
//       return element.map(el => {
//         return {
//           code: el.alpha2Code,
//           population: el.population,
//         }
//       })
//     }),
//     catchError((err) => of(null)),
//     map<Country[], Book>(countryData => {
//       return this.mapBook(countryData, bookData, filmData);
//     })
//   )
// } else {
//   return of(this.mapBook(null, bookData, null));
// }
// }



// mapBook(countries: Country[], book: BookApiResult, movie: MovieApiResult): Book {
// return {
//   title: book?.items[0].volumeInfo?.title,
//   authors: book?.items[0].volumeInfo?.authors[0],
//   categories: book?.items[0].volumeInfo?.categories[0],
//   description: book?.items[0].volumeInfo?.description,
//   publishedDate: book?.items[0].volumeInfo?.publishedDate,
//   publisher: book?.items[0].volumeInfo?.publisher,
//   imageLinks: book?.items[0].volumeInfo?.imageLinks?.smallThumbnail,
//   countries: countries?.map(el => el),
//   movie: {
//     released: movie?.Released,
//     response: movie?.Response
//   }
// }
// }






// best so far:


// this.bookFireServie.getBookData().pipe(
//   switchMap(fireData => {
//     return forkJoin(fireData.map(el => this.bookApiService.getFilmByName(el.title).pipe(
//       map(eachFilm => {
//         return {
//           fireData: el,
//           filmData: eachFilm
//         }
//       })
//     )))
//   })

// ).subscribe(el => console.log(el))

// }





// //kidev ufro kargi
// this.bookFireServie.getBookData().pipe(
//   switchMap(fireData => {
//     return forkJoin(fireData.map(el => this.bookApiService.getFilmByName(el.title).pipe(
//      switchMap(film =>{
//        return this.bookApiService.getCountryByCode(film.Country).pipe(
//          map(val => {
//            return {
//              country: {
//                code: val.alpha2Code,
//                population: val.population
//              },
//              film,
//              el
//            }
//          }), catchError(err => of(el))
//        )
//      })
      
//     )))
//   })

// ).subscribe(el => console.log(el))