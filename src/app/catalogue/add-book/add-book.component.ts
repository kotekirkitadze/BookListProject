import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { BookApiService } from '../services/book-api.services';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {

  starRating = faStar;
  searchData: string;
  errorVal: boolean;
  lastThreeSearches: string[] = [];

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

  searchBook(key: string) {
    if (!key || key == " ") {
      this.errorVal = true;
      return;
    }
    this.errorVal = false;

    this.pushInlastSearches(key);
    this.getBooksFromApi(key);

  }

  getBooksFromApi(name: string) {
    this.loadingService.start();
    this.apiService.getBookByName(name).pipe(finalize(() => {
      this.loadingService.stop();
      this.searchData = "";
    })).subscribe((x) => console.log(x))
  }

  constructor(private loadingService: LoadingService,
    private apiService: BookApiService,
    private storage: StorageService) { }


  restoreSearches() {
    const searchesInStorage = this.storage.get<string[]>("lastThreSearches");
    if (searchesInStorage?.length > 0) {
      this.lastThreeSearches = searchesInStorage;
    }
  }


  ngOnInit(): void {
    this.restoreSearches();
  }

}
