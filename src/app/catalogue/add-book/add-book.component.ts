import { Component, OnInit } from '@angular/core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder } from '@angular/forms';
import { Book } from '../catalogue.model';
import { AddBookFacade } from './add-book.facade';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
  providers: [AddBookFacade]
})
export class AddBookComponent implements OnInit {

  constructor(private facade: AddBookFacade) { }

  starRating = faStar;
  searchData: string; //tranfered
  fb: FormBuilder;

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
    this.facade.searchBook(key).subscribe((selectedBook) => {
      this._selectedBook = selectedBook;
    });
  }

  getBooksFromApi(name: string) {
    this.facade.searchFromStoreData(name).subscribe((selectedBook) => {
      this._selectedBook = selectedBook;
    });
  }

  restoreSearches() {
    this.facade.restoreSearches();
  }

  ngOnInit(): void {
    this.restoreSearches();
  }
}
