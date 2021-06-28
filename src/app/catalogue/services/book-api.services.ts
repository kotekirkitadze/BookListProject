import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { BookApiResult } from '../catalogue.model';


export const BOOK_API = new InjectionToken<string>("book API")

@Injectable()
export class BookApiService {

  constructor(@Inject(BOOK_API) private book_url: string,
    private http: HttpClient) { }

  getBookByName(name: string): Observable<BookApiResult> {
    return this.http.get<BookApiResult>(`${this.book_url}=${name}`);
  }
}
