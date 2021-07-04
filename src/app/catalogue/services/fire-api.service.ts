import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { fireBookBody, fireBookDataWithId } from '../catalogue.model';


@Injectable()
export class FireApiService {

  constructor(private store: AngularFirestore,
    private auth: AuthService) { }

  //fireBookDataWithId

  postBookData(body: fireBookBody) {
    return from(this.store.collection("bookCatalogue").add(body));
  }


  //data თი შეგვიძლია მივწდეთ ველიუბს, ხოლოდ id - ით კი დოკუმენტის აიდებს.
  getBooksData(): Observable<fireBookDataWithId[]> {
    return this.store.collection<fireBookBody>("bookCatalogue",
      ref => ref.where('uid', '==', this.auth.getUserUid()))
      .get()
      .pipe(
        map(result => result.docs.map<fireBookDataWithId>((d) => ({ id: d.id, ...d.data() })))
      )
  }

  getBookData(id: string): Observable<fireBookBody> {
    //valueChange ხშირად აბრუნებსო, ეგრევე რეაგირებსო.
    // return this.store.collection<fireBookBody>("bookCatalogue",
    //   ref => ref.where('uid', '==', this.auth.getUserUid())).doc(id).valueChanges();


    return this.store.collection<fireBookBody>("bookCatalogue",
      ref => ref.where('uid', '==', this.auth.getUserUid())).doc(id)
      .get().pipe(map(res => res.data()))

  }
}
