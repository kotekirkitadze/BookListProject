import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BookApiResult, CountryApiResult, MovieApiResult } from '../catalogue.model';


export const BOOK_API = new InjectionToken<string>("book API");
export const MOVIE_API = new InjectionToken<string>("movie API");
export const COUNTRY_API = new InjectionToken<string>("country API");
@Injectable()
export class BookApiService {

  constructor(@Inject(BOOK_API) private book_url: string,
    @Inject(MOVIE_API) private movie_url: string,
    @Inject(COUNTRY_API) private country_url: string,
    private http: HttpClient) { }

  getBookByName(name: string): Observable<BookApiResult> {
    return this.http.get<BookApiResult>(`${this.book_url}=${name}`);
  }

  getFilmByName(name: string): Observable<MovieApiResult> {
    return this.http.get<MovieApiResult>(`${this.movie_url}=${name}&apikey=469ad1a3`);
  }

  getCountryByCode(code: string): Observable<CountryApiResult> {
    return this.http.get<CountryApiResult>(`${this.country_url}/${code}?fullText=true`).pipe(
      map(data => data[0])
      // tap((x) => console.log(x))
    );
  }

}
