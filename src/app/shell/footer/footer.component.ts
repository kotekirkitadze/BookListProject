import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private translateService: TranslateService) { }


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

  private isLanguage(lang: string): boolean {
    const defLang = this.translateService.defaultLang;
    const currLang = this.translateService.currentLang;

    return currLang ? currLang == lang : defLang == lang;
  }


  ngOnInit(): void {
  }


}
