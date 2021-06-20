import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

export interface SignUpFormUser {
  email: string;
  password: string;

}


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private auth: AuthService, private route: Router,
    private loadingService: LoadingService) { }

  ngOnInit(): void {
  }

  signUp({ email, password }: SignUpFormUser) {
    if (!email || !password) {
      return;
    }
    this.loadingService.start();
    this.auth.signUpUser({ email, password }).
      then(() => {
        this.loadingService.stop();
        this.route.navigate(['catalogue'])
      });
  }



}
