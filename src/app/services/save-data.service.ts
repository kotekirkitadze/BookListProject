import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface User {
  name?: string;
  uid?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {
  private itemCollections: AngularFirestoreCollection<User>;
  private itemDocument: AngularFirestoreDocument<User>;
  items: Observable<User[]>;
  currentUser$: Observable<User>;
  itemDoc: AngularFirestoreDocument<User>;
  constructor(private afs: AngularFirestore,
    private auth: AngularFireAuth) {
    this.itemCollections = this.afs.collection('users');
    this.items = this.itemCollections.valueChanges();

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
    this.itemCollections.doc(userId).set({ "name": name });
  };

  deleteUserData(item: User) {
    this.itemDoc = this.afs.doc(`users/${item.uid}`);
    this.itemDoc.delete();
  }

}





