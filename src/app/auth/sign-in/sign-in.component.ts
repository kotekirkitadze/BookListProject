import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export interface SignInFormUser {
  email: string;
  password: string;
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})


export class SignInComponent implements OnInit {

  constructor(private route: Router,
              private auth: AuthService) { }

  ngOnInit(): void {
  }


  signIn({ email, password }: SignInFormUser) {
    if (!email || !password) {
      return;
    }
    this.auth.signInUser({email, password}).
    then(() => {
      this.route.navigate(['catalogue']);
    });
  }

  toResetPasswrd(){
    this.route.navigate(['reset-passw']);
  }
}
