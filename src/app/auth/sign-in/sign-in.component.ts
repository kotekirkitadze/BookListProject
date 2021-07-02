import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SaveDataService } from 'src/app/services/save-data.service';

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
    private auth: AuthService,
    private loadingService: LoadingService) { }

  ngOnInit(): void {

  }


  signIn({ email, password }: SignInFormUser) {
    if (!email || !password) {
      return;
    }

    this.loadingService.start();
    // this.auth.signInUser({ email, password }).
    //   then(() => {
    //     this.loadingService.stop();
    //     this.route.navigate(['catalogue']);

    //   });


    //this.saveData.update("kirkitadze");
    //radganac network call aris, unsubscribe aghar unda
    from(this.auth.signInUser({ email, password })).
      pipe(finalize(() => this.loadingService.stop())).
      subscribe(() => this.route.navigate(['catalogue']));
  }

  toResetPasswrd() {
    this.route.navigate(['reset-passw']);
  }


}
