import { Injectable } from '@angular/core';
import {
  Book,
  Country,
  CountryApiResult,
  BookApiResult,
  MovieApiResult
} from '../catalogue.model';
import { forkJoin, of } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { finalize, map, switchMap, catchError } from 'rxjs/operators';
import { BookApiService } from '.';



@Injectable()
export class AddBookService {

  constructor(private loadingService: LoadingService,
    private apiService: BookApiService) {

  }

  searchData: string;


  mapToMovie(filmData: MovieApiResult, bookData: BookApiResult) {
    if (filmData.Response == "True") {
      const countries = filmData.Country.split(', ');
      return forkJoin(countries.map((countryCode) => {
        if (countryCode.includes(" ")) {
          return null
        } else {
          this.apiService.getCountryByCode(countryCode)
        }
      })).pipe(
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
    //this.loadingService.start();
    return this.apiService.getBookByName(name).pipe(
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
    );
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
        response: movie?.Response,
        director: movie?.Director,
        year: Number(movie?.Year)
      }
    }
  }
}
