import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { fireBookBody } from '../catalogue/catalogue.model';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';

export interface User {
  name?: string;
  uid?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {
  private userCollections: AngularFirestoreCollection<User>;
  private itemDocument: AngularFirestoreDocument<User>;
  items: Observable<User[]>;
  currentUser$: Observable<User>;
  itemDoc: AngularFirestoreDocument<User>;

  constructor(private afs: AngularFirestore,
    private http: HttpClient,
    private auth: AngularFireAuth,
    private navRouting: Router,
    private loadingService: LoadingService) {
    this.userCollections = this.afs.collection('users');
    this.items = this.userCollections.valueChanges();

    this.currentUser$ = this.auth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          //value changes() returns collections as observable
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      }))
  }


  getItem(): Observable<User> {
    return this.currentUser$;
  }


  registerData(userId: string, name: string) {
    this.userCollections.doc(userId).set({ "name": name });

  };

  deleteUserData(item: User) {
    // this.bookCollection = this.afs.doc(`users/${item.uid}`).collection("bookCollection");
    // this.bookCollection.stateChanges;
    this.itemDoc = this.afs.doc(`users/${item.uid}`);
    this.itemDoc.delete();
  }


  deleteUser(currentUser: AuthService) {
    this.loadingService.start();
    const url = "https://us-central1-book-catalogue-d3599.cloudfunctions.net/deleteUserByEmail";
    const user = {
      "userEmail": currentUser.getCurrentUser().email
    }
    this.http.post(url, user).subscribe(() => {

      this.deleteUserData(currentUser.getCurrentUser());
      currentUser.signOutUser().then(() => {
        this.navRouting.navigate(["sign-in"]);
        this.loadingService.stop();
      })
    });
  }

  updateUser(user: User) {
    this.itemDoc = this.afs.doc(`users/${user.uid}`);
    const reneWedUser: User = { name: user.name }
    this.itemDoc.update(reneWedUser);
  }


  postBookData(body: fireBookBody) {
    return from(this.afs.collection("bookCatalogue").add(body));
  }

  updatePassword(newPassword: string) {
    this.auth.currentUser.then((user) => user.updatePassword(newPassword));
  }
  updateEmail(newEmail: string) {
    this.auth.currentUser.then(user => user.updateEmail(newEmail))
  }

}




