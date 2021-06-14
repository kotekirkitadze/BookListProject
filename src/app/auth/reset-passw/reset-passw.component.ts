import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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
    private auth: AuthService) { }

  ngOnInit(): void {
  }

  resetPassword({ email }: ResetFormUser) {
    if (!email) {
      return;
    }
    this.auth.resetUserPassword({ email }).
      then(() => {
        this.route.navigate(['sign-in']);
      });
  }

}
