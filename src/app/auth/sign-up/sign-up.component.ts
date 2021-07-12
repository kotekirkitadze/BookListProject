import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SaveDataService } from 'src/app/catalogue/services/userinfo_fire.service';
import { BackEndErrorService } from '../backEndErrors/backEndErroro.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private auth: AuthService, private route: Router,
    private loadingService: LoadingService,
    private saveData: SaveDataService,
    private backErrorService: BackEndErrorService,
    private translateService: TranslateService,
    private toastr: ToastrService) { }

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
        this.loadingService.stop()
      })).
      subscribe(
        () => {
          this.route.navigate(['catalogue']);
          this.saveData.registerData(this.auth.getCurrentUser()?.uid, fullName);
          this.translateService.get("auth.USER_CREATED").subscribe((value) => this.toastr.success(value))
        },
        (error) => this.backErrorService.setBackEndError(error))
  }

  get backError(): string {
    return this.backErrorService.getError;
  }
}
