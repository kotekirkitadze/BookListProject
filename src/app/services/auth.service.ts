import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { SignInFormUser, SignUpFormUser, ResetFormUser } from '../auth/index';

interface User {
  uid: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userChange: User;

  isLoggedIn(): boolean {
    return !!this.userChange;
  }

  getCurrentUser(): User {
    return !!this.userChange ? this.userChange : null;
  }

  getUserEmail(): string {
    return this.userChange?.email;
  }

  getUserUid(): string {
    return this.userChange?.uid;
  }

  constructor(private auth: AngularFireAuth) {
    this.auth.onAuthStateChanged((user) => {
      console.log(user);
      this.userChange = user;
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



