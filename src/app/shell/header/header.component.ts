import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';
import { AngularFireAuth } from '@angular/fire/auth';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/services/loading.service';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SaveDataService } from 'src/app/catalogue/services/userinfo_fire.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  faBook = faBookReader;
  fauser = faUser;
  userName: string;



  constructor(private navRouting: Router,
    private auth: AuthService, private qq: AngularFireAuth,
    private loadingService: LoadingService,
    private saveData: SaveDataService) {
  }

  ngOnInit(): void {
    this.saveData.getItem().subscribe((user) => {
      this.userName = user?.name;
    })
  }

  toHome() {
    this.navRouting.navigate(['']);
  }

  toSignIn() {
    this.navRouting.navigate(['sign-in']);
  }

  toSignUp() {
    this.navRouting.navigate(['sign-up']);
  }

  toCatalogue() {
    this.navRouting.navigate(['catalogue']);
  }

  toUser() {
    this.navRouting.navigate(["catalogue/user"]);
  }


  signOut() {
    this.loadingService.start();
    from(this.auth.signOutUser()).
      pipe(finalize(() => this.loadingService.stop())).
      subscribe(() => this.navRouting.navigate(['sign-in']));
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get isInitiated(): boolean {
    return this.auth.getIsInitiated();
  }

}
