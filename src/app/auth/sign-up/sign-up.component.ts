import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SaveDataService } from 'src/app/services/save-data.service';

export interface SignUpFormUser {
  fullName: string
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
    private loadingService: LoadingService,
    private saveData: SaveDataService) { }

  ngOnInit(): void {
  }

  signUp(signUpForm: NgForm) {
    console.log(signUpForm);
  if(signUpForm.invalid){
    return;
  }
    
    const {email, password, fullName} = signUpForm.value;

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
    from(this.auth.signUpUser({ email, password, fullName })).
      pipe(finalize(() => {
        this.loadingService.stop(),
        this.saveData.registerData(this.auth.getUserUid(), fullName)
      })).
      subscribe(() => this.route.navigate(['catalogue']))
  }



}
