import { Injectable } from "@angular/core";
import { StorageService } from "src/app/services/storage.service";
import { AddBookService } from "./add-book.service";

@Injectable()

export class AddBookFacade {

  constructor(private storage: StorageService,
    private addBookService: AddBookService) {

  }

  errorVal: boolean;
  lastThreeSearches: string[] = [];

  searchBook(key: string) {
    if (!key || key == " ") {
      this.errorVal = true;
      return null;
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
