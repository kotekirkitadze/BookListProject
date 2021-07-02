import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { fireBookBody } from '../catalogue.model';
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

  ngOnInit(): void {
    this.bookFireServie.getBookData().pipe(
      switchMap(fireData => {
        return forkJoin(fireData.map(element => this.bookApiService.getBookByName(element.title))).pipe(
          switchMap(bookData => {
            return forkJoin(bookData.map(el => {
              const book = el.items[0].volumeInfo
              return this.bookApiService.getFilmByName(book.title)
            })).pipe(map(filmData => {
              return forkJoin(filmData.map(el => this.bookApiService.getCountryByCode(el.Country)))
            }))

          })
        )

      })
    ).subscribe(val => console.log(val));
  }

}
