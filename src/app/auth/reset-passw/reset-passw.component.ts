import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BackEndErrorService } from '../backEndErrors/backEndErroro.service';
import { BakcEndError } from '../sign-in/sign-in.component';

export interface ResetFormUser {
  email: string;
}

@Component({
  selector: 'app-reset-passw',
  templateUrl: './reset-passw.component.html',
  styleUrls: ['./reset-passw.component.scss']
})
export class ResetPasswComponent implements OnInit {

  constructor(private route: Router,
    private auth: AuthService,
    private backErrorService: BackEndErrorService) { }

  ngOnInit(): void {
  }

  resetPassword({ email }: ResetFormUser) {
    if (!email) {
      return;
    }

    this.auth.resetUserPassword({ email }).
      subscribe(
        () => this.route.navigate(['sign-in']),
        (error) => this.backErrorService.setBackEndError(error)
      );
  }

  get getError(): string {
    return this.backErrorService.getError;
  }

  backError: string;
  backEndError(error: BakcEndError) {
    if (error.code == "auth/user-not-found") {
      this.backError = "notUser"
    } else {
      return null
    }
  }

}
