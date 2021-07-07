import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { fireBookBody, fireBookDataWithId } from '../catalogue.model';


@Injectable()
export class FireCollectionApiService {
  items: Observable<fireBookBody>;

  constructor(private store: AngularFirestore,
    private auth: AuthService) { }

  //fireBookDataWithId

  postBookData(body: fireBookBody) {
    return from(this.store.collection("bookCatalogue").add(body));
  }

  deleteBook(id: string) {
    return from(this.store.doc<fireBookBody>(`bookCatalogue/${id}`).delete());
  }

  //data თი შეგვიძლია მივწდეთ ველიუბს, ხოლოდ id - ით კი დოკუმენტის აიდებს.
  getBooksData(): Observable<fireBookDataWithId[]> {
    return this.store.collection<fireBookBody>("bookCatalogue",
      ref => ref.where('uid', '==', this.auth.getCurrentUser().uid))
      .get()
      .pipe(
        map(result => result.docs.map<fireBookDataWithId>((d) => ({ id: d.id, ...d.data() })))
      )
  }

  getBookData(id: string): Observable<fireBookBody> {
    return this.store.collection<fireBookBody>("bookCatalogue",
      ref => ref.where('uid', '==', this.auth.getCurrentUser().email)).doc(id)
      .get().pipe(map(res => res.data()))

  }
}
