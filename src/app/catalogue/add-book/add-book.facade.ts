import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { LoadingService } from "src/app/services/loading.service";
import { StorageService } from "src/app/services/storage.service";
import { AddBookService } from "../services/index";

@Injectable()

export class AddBookFacade {

  constructor(private storage: StorageService,
    private addBookService: AddBookService,
    private loadingService: LoadingService) {

  }

  errorVal: boolean;
  lastThreeSearches: string[] = [];

  searchBook(key: string) {
    if (!key || key == " ") {
      this.errorVal = true;
      this.loadingService.stop()
      return of(null);
    }
    this.errorVal = false;
    this.pushInlastSearches(key);
    return this.addBookService.getBooksFromApi(key);

  }

  searchFromStoreData(key: string) {
    return this.addBookService.getBooksFromApi(key);
  }

  pushInlastSearches(name: string) {
    if (this.lastThreeSearches.length < 3) {
      this.lastThreeSearches.unshift(name);
      this.storage.set<string[]>("lastThreSearches", this.lastThreeSearches);
      return;
    }

    this.lastThreeSearches.splice(2, 1);
    this.lastThreeSearches.unshift(name);
    this.storage.set<string[]>("lastThreSearches", this.lastThreeSearches);
  }

  restoreSearches() {
    const searchesInStorage = this.storage.get<string[]>("lastThreSearches");
    if (searchesInStorage?.length > 0) {
      this.lastThreeSearches = searchesInStorage;
    }
  }
}
