import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  Book,
  Status,
  TIME_TO_READ,
  WhenToReadSelect,
  Country
} from '../../catalogue.model';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { BookInfoFacade } from './book-info.facade';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-book-info',
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.scss'],
  providers: [BookInfoFacade]
})
export class BookInfoComponent implements OnInit, OnDestroy {
  @Input() _selectedBook: Book;


  constructor(private facade: BookInfoFacade) { }

  ngOnInit(): void {
    this.createForm();

    this.form.get('status').valueChanges.pipe(takeUntil(this.unsubscribe$))
      //აქ ეროუ ფანქშენის გაერეშე ვერ გააყოლა ედდ კონტროლი, კონტექსტი ვერ შეგვინახა
      .subscribe((status) => this.addControlByStatus(status));
  }

  get submitted(): boolean {
    return this.facade.submitted;
  }
  private unsubscribe$ = new Subject();

  check = faCheck;
  ban = faBan;
  faPlus = faPlus;
  status = Status;

  createForm() {
    this.facade.createForm();
  }

  get form(): FormGroup {
    return this.facade.form;
  }

  private addControlByStatus(status: Status) {
    this.facade.addControlByStatus(status)
  }

  get getSelectedBook(): Book {
    return this._selectedBook;
  }

  get timeToRead(): WhenToReadSelect[] {
    return TIME_TO_READ;
  }

  submit() {
    this.facade.submit(this._selectedBook.title)?.pipe(
      finalize(() => this._selectedBook = null)
    ).subscribe();

  }

  getCountryFlag(country: Country) {
    return this.facade.getCountryFlag(country)
  }
  getCountryPopulation(country: Country) {
    return this.facade.getCountryPopulation(country);
  }

  get whenToRead(): boolean {
    return !!this.form.get('whenToRead');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
