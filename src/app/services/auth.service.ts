import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SignInFormUser, SignUpFormUser, ResetFormUser, User } from '../auth/index';
import { UserFireInfoService } from '../catalogue/services/index';

export const USER_DELETE_URL = new InjectionToken<string>("delete user API");

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
    @Inject(USER_DELETE_URL) private delete_user_url: string,
    private userInfoFireService: UserFireInfoService) {
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
    const user = {
      "userEmail": this._userChange.email
    }
    return this.http.post(this.delete_user_url, user).pipe(switchMap(() => {
      this.userInfoFireService.deleteUserData(this._userChange);
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


