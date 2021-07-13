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
import { finalize, map, switchMap, catchError, tap } from 'rxjs/operators';
import { AllDataApiService } from './index';



@Injectable()
export class FetchDataApi {

  constructor(private loadingService: LoadingService,
    private apiService: AllDataApiService) {

  }

  searchData: string;

  getCountries(filmData: MovieApiResult) {
    const countries = filmData.Country.split(', ');
    return forkJoin(countries.map((countryCode) => {
      if (countryCode.includes(" ")) {
        return null
      } else {
        return this.apiService.getCountryByCode(countryCode)
      }
    }))
  }

  mapToFireData(filmData: MovieApiResult, bookData: BookApiResult) {
    if (filmData.Response == "True") {
      return this.getCountries(filmData).pipe(
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
          return this.mapFireDataModel(countryData, bookData, filmData);
        })
      )
    } else {
      return of(this.mapFireDataModel(null, bookData, null));
    }
  }


  getBooksFromApi(name: string) {
    return this.apiService.getBookByName(name).pipe(
      finalize(() => {
        this.loadingService.stop();
        this.searchData = "";
      }),
      switchMap((bookData) => {
        const bookInfo = bookData?.items[0]?.volumeInfo
        const title = bookInfo.title;
        return this.apiService.getFilmByName(title).pipe(
          switchMap((filmData) => this.mapToFireData(filmData, bookData))
        )
      }),
    );
  }

  mapFireDataModel(countries: Country[], book: BookApiResult, movie: MovieApiResult): Book {
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
