import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  faBook = faBookReader;

  get isKa() {
    return this.isLanguage('ka');
  }

  get isEn() {
    return this.isLanguage('en');
  }
  constructor(private navRouting: Router,
    private translateService: TranslateService,
    private auth: AuthService) { }

  ngOnInit(): void {
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

  useEn() {
    this.translateService.use("en");
  }

  useGe() {
    this.translateService.use("ka");
  }

  private isLanguage(lang: string): boolean {
    const defLang = this.translateService.defaultLang;
    const currLang = this.translateService.currentLang;

    return currLang ? currLang == lang : defLang == lang;
  }

  signOut() {
    this.auth.signOutUser().then(() => {
      this.navRouting.navigate(['sign-in']);
    })
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}
