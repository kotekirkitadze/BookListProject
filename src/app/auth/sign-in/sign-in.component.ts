import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { finalize } from 'rxjs/operators';
import { BackEndErrorService } from '../backEndErrors/backEndErroro.service';
import { SignInFormUser } from '../auth.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  constructor(
    private route: Router,
    private auth: AuthService,
    private loadingService: LoadingService,
    private backErrorService: BackEndErrorService
  ) {}

  ngOnInit(): void {}

  signIn({ email, password }: SignInFormUser) {
    if (!email || !password) {
      return;
    }

    this.loadingService.start();
    this.auth
      .signInUser({ email, password })
      .pipe(
        finalize(() => this.loadingService.stop())
      )
      .subscribe(
        () => this.route.navigate(['catalogue']),
        (error) =>
          this.backErrorService.setBackEndError(
            error
          )
      );
  }

  get getError(): string {
    return this.backErrorService.getError;
  }

  toResetPasswrd() {
    this.route.navigate(['reset-passw']);
  }
}
