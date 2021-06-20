import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
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
    // this.auth.signUpUser({ email, password }).
    //   then(() => {
    //     this.loadingService.stop();
    //     this.route.navigate(['catalogue'])
    //   });

    //radganac network call aris, unsubscribe aghar unda
    from(this.auth.signUpUser({ email, password })).
      pipe(finalize(() => this.loadingService.stop())).
      subscribe(() => this.route.navigate(['catalogue']))
  }



}
