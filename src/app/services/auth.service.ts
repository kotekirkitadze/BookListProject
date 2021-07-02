import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
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
    return this.auth.signInWithEmailAndPassword(email, password);

  }

  signUpUser({ email, password }: SignUpFormUser) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  signOutUser() {
    return this.auth.signOut();
  }

  resetUserPassword({ email }: ResetFormUser) {
    return this.auth.sendPasswordResetEmail(email);
  }
}


