import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookApiResult, CountryApiResult, MovieApiResult } from '../catalogue.model';


export const BOOK_API = new InjectionToken<string>("book API")

@Injectable()
export class BookApiService {

  constructor(@Inject(BOOK_API) private book_url: string,
    private http: HttpClient) { }

  getBookByName(name: string): Observable<BookApiResult> {
    return this.http.get<BookApiResult>(`${this.book_url}=${name}`);
  }

  getFilmByName(name: string): Observable<MovieApiResult> {
    return this.http.get<MovieApiResult>(`http://www.omdbapi.com/?t=${name}&apikey=469ad1a3`);
  }

  getCountryByCode(code: string): Observable<CountryApiResult> {
    return this.http.get<CountryApiResult>(`https://restcountries.eu/rest/v2/name/${code}?fullText=true`).pipe(
      map(data => data[0])
    );
  }

}
