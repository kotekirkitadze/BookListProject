import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Country } from '../catalogue.model';

@Injectable()
export class FlagInfoService {

  constructor(private translateService: TranslateService) {

  }

  private isLanguage(lang: string): boolean {
    const defLang = this.translateService.defaultLang;
    const currLang = this.translateService.currentLang;

    return currLang ? currLang == lang : defLang == lang;
  }

  getCountryFlag(country: Country) {
    return `https://www.countryflags.io/${country.code}/shiny/64.png`
  }

  getCountryPopulation(country: Country): string {
    let text: string = "";

    if (this.isLanguage("en")) {
      this.translateService
        .get("catalogue.searchPage.COUNTRY_TOOLTIP")
        .subscribe(value => text = `${value} ${country.code}: ${country.population}`);
      return text;
    } else {
      this.translateService
        .get("catalogue.searchPage.COUNTRY_TOOLTIP")
        .subscribe(value => text = `${country.code} ${value} ${country.population}`);
      return text;
    }

  }

}
