import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SaveDataService } from 'src/app/catalogue/services/userinfo_fire.service';
import { BackEndErrorService } from '../backEndErrors/backEndErroro.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private auth: AuthService, private route: Router,
    private loadingService: LoadingService,
    private saveData: SaveDataService,
    private backErrorService: BackEndErrorService) { }

  ngOnInit(): void {
  }

  signUp(signUpForm: NgForm) {
    if (signUpForm.invalid) {
      return;
    }

    const { email, password, fullName } = signUpForm.value;

    if (!email || !password) {
      return;
    }
    this.loadingService.start();
    this.auth.signUpUser({ email, password, fullName }).
      pipe(finalize(() => {
        this.loadingService.stop(),
          this.saveData.registerData(this.auth.getCurrentUser().uid, fullName)
      })).
      subscribe(
        () => this.route.navigate(['catalogue']),
        (error) => this.backErrorService.setBackEndError(error))
  }

  get backError(): string {
    return this.backErrorService.getError;
  }
}
