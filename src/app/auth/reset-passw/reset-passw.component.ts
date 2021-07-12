import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BackEndErrorService } from '../backEndErrors/backEndErroro.service';
import { ResetFormUser } from "../auth.model"

@Component({
  selector: 'app-reset-passw',
  templateUrl: './reset-passw.component.html',
  styleUrls: ['./reset-passw.component.scss']
})
export class ResetPasswComponent implements OnInit {

  constructor(private route: Router,
    private auth: AuthService,
    private backErrorService: BackEndErrorService,
    private translateService: TranslateService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  resetPassword({ email }: ResetFormUser) {
    if (!email) {
      return;
    }

    this.auth.resetUserPassword({ email }).
      subscribe(
        () => {
          this.route.navigate(['sign-in']);
          this.translateService
            .get("auth.PASSWORD_HAS_SENT")
            .subscribe((value) => this.toastr.success(value))
        },
        (error) => this.backErrorService.setBackEndError(error)
      );

  }

  get getError(): string {
    return this.backErrorService.getError;
  }
}
