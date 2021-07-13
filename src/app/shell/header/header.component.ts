import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';
import { AngularFireAuth } from '@angular/fire/auth';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/services/loading.service';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserFireInfoService } from 'src/app/catalogue/services/index';
import { TranslateService } from '@ngx-translate/core';

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
    private userInfoFireService: UserFireInfoService,
    private translateService: TranslateService) {
  }

  private isLanguage(lang: string): boolean {
    const defLang = this.translateService.defaultLang;
    const currLang = this.translateService.currentLang;

    return currLang ? currLang == lang : defLang == lang;
  }

  get isKa() {
    return this.isLanguage('ka');
  }

  get isEn() {
    return this.isLanguage('en');
  }

  useEn() {
    this.translateService.use("en");
  }

  useGe() {
    this.translateService.use("ka");
  }

  ngOnInit(): void {
    this.userInfoFireService.getItem().subscribe((user) => {
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
