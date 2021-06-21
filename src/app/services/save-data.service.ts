import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface User {
  uid: string;
  email?: string;
  name?: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {
  private itemCollections: AngularFirestoreCollection<any>;
  items: Observable<any[]>;
  currentUser$: Observable<any>;
  
  constructor(private afs: AngularFirestore,
    private auth: AngularFireAuth) {
      this.itemCollections = this.afs.collection('users');
      this.items =this.itemCollections.valueChanges();

      this.currentUser$ = this.auth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        }))
    }
    


    getItem(){
      return this.currentUser$;
    }
  


    
    registerData(userId: string, name: string){
      this.itemCollections.doc(userId).set({"name": name});
    };

}





