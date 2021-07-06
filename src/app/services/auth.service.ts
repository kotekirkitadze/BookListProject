import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SignInFormUser, SignUpFormUser, ResetFormUser } from '../auth/index';
import { SaveDataService } from './userinfo_fire.service';

interface User {
  uid: string;
  email: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _userChange: User;
  private _isInitiated: boolean = false;

  getIsInitiated(): boolean {
    return this._isInitiated;
  }

  isLoggedIn(): boolean {
    return !!this._userChange;
  }

  getCurrentUser(): User {
    return !!this._userChange ? this._userChange : null;
  }

  constructor(private auth: AngularFireAuth,
    private http: HttpClient,
    private navRouting: Router,
    private saveData: SaveDataService) {
    this.auth.onAuthStateChanged((user) => {
      this._userChange = user;
      if (!this._isInitiated) {
        this._isInitiated = true;
      }
    });
  }

  signInUser({ email, password }: SignInFormUser) {
    return from(this.auth.signInWithEmailAndPassword(email, password));

  }

  signUpUser({ email, password }: SignUpFormUser) {
    return from(this.auth.createUserWithEmailAndPassword(email, password));
  }

  signOutUser() {
    return from(this.auth.signOut());
  }

  resetUserPassword({ email }: ResetFormUser) {
    return from(this.auth.sendPasswordResetEmail(email));
  }



  deleteUser() {
    //this.loadingService.start();
    const url = "https://us-central1-book-catalogue-d3599.cloudfunctions.net/deleteUserByEmail";
    const user = {
      "userEmail": this._userChange.email
    }
    return this.http.post(url, user).pipe(switchMap(() => {
      this.saveData.deleteUserData(this._userChange);
      return this.signOutUser().pipe(tap(() => {
        this.navRouting.navigate(["sign-in"]);
      }))
    }))
  }

  updatePassword(newPassword: string) {
    return from(this.auth.currentUser).pipe(tap(user => user.updatePassword(newPassword)))

  }
  updateEmail(newEmail: string) {
    return from(this.auth.currentUser).pipe(tap(user => user.updateEmail(newEmail)));
  }
}


