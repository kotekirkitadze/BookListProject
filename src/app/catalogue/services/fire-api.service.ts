import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { fireBookBody } from '../catalogue.model';


@Injectable()
export class FireApiService {

  constructor(private store: AngularFirestore,
    private auth: AuthService) { }


  postBookData(body: fireBookBody) {
    return from(this.store.collection("bookCatalogue").add(body));
  }

  getBookData(): Observable<fireBookBody[]> {
    return this.store.collection<fireBookBody>("bookCatalogue",
      ref => ref.where('uid', '==', this.auth.getUserUid())).valueChanges()
  }

}
