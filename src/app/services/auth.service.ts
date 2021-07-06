import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SignInFormUser, SignUpFormUser, ResetFormUser } from '../auth/index';

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

  getUserEmail(): string {
    return this._userChange?.email;
  }

  getUserUid(): string {
    return this._userChange?.uid;
  }

  constructor(private auth: AngularFireAuth) {
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
    return from(this.auth.createUserWithEmailAndPassword(email, password))
      .pipe(catchError(err => of(null)));
  }

  signOutUser() {
    return from(this.auth.signOut())
      .pipe(catchError(err => of(null)));
  }

  resetUserPassword({ email }: ResetFormUser) {
    return from(this.auth.sendPasswordResetEmail(email));
  }
}


