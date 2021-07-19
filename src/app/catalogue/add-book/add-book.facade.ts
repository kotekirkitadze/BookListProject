import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { FetchDataApi } from '../services/index';

@Injectable()
export class AddBookFacade {
  constructor(
    private storage: StorageService,
    private fetchDataApi: FetchDataApi,
    private loadingService: LoadingService
  ) {}

  errorVal: boolean;
  lastThreeSearches: string[] = [];

  searchBook(key: string) {
    if (!key || key == ' ') {
      this.errorVal = true;
      this.loadingService.stop();
      return of(null);
    }
    this.errorVal = false;
    this.pushInlastSearches(key);
    return this.fetchDataApi.getBooksFromApi(key);
  }

  searchFromStoreData(key: string) {
    this.errorVal = false;
    return this.fetchDataApi.getBooksFromApi(key);
  }

  pushInlastSearches(name: string) {
    if (this.lastThreeSearches.length < 3) {
      this.lastThreeSearches.unshift(name);
      this.storage.set<string[]>(
        'lastThreSearches',
        this.lastThreeSearches
      );
      return;
    }

    this.lastThreeSearches.splice(2, 1);
    this.lastThreeSearches.unshift(name);
    this.storage.set<string[]>(
      'lastThreSearches',
      this.lastThreeSearches
    );
  }

  restoreSearches() {
    const searchesInStorage = this.storage.get<
      string[]
    >('lastThreSearches');
    if (searchesInStorage?.length > 0) {
      this.lastThreeSearches = searchesInStorage;
    }
  }
}
