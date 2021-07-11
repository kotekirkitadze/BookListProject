import { Component, OnInit } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder } from '@angular/forms';
import { Book } from '../catalogue.model';
import { AddBookFacade } from './add-book.facade';
import { LoadingService } from 'src/app/services/loading.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
  providers: [AddBookFacade]
})
export class AddBookComponent implements OnInit {

  constructor(private facade: AddBookFacade,
    private loadingService: LoadingService) { }

  starRating = faStar;
  notFoundError: boolean = false;
  searchData: string;
  // fb: FormBuilder;

  get errorVal() {
    return this.facade.errorVal;
  }

  _selectedBook: Book; //tranfered

  get lastThreeSearches(): string[] {
    return this.facade.lastThreeSearches;
  }

  setLastThreeSearches(data: string[]) {
    this.facade.lastThreeSearches = data;
  }

  pushInlastSearches(name: string) {
    this.facade.pushInlastSearches(name);
  }

  searchBook(key: string) {
    this.loadingService.start();
    this.facade.searchBook(key)
      .pipe(finalize(() => this.loadingService.stop()))
      .subscribe((selectedBook) => {
        this._selectedBook = selectedBook;
        this.notFoundError = false;
      },
        () => this.notFoundError = true);

  }

  getBooksFromApi(name: string) {
    this.loadingService.start();

    this.facade.searchFromStoreData(name)
      .pipe(finalize(() => this.loadingService.stop()))
      .subscribe(
        (selectedBook) => {
          this._selectedBook = selectedBook;
          this.notFoundError = false;
        },
        () => this.notFoundError = true);
  }

  restoreSearches() {
    this.facade.restoreSearches();
  }

  ngOnInit(): void {
    this.restoreSearches();
  }
}
