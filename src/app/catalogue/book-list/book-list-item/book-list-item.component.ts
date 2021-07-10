import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ListData, TIME_TO_READ, WhenToReadSelect } from '../../catalogue.model';

@Component({
  selector: 'app-book-list-item',
  templateUrl: './book-list-item.component.html',
  styleUrls: ['./book-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookListItemComponent implements OnInit {

  @Input() data: ListData;
  @Output() deleteBtn = new EventEmitter();

  constructor(private router: Router) { }

  get whenToRead(): WhenToReadSelect[] {
    return TIME_TO_READ;
  }


  delete() {
    this.deleteBtn.emit(this.data.fireData.id);
  }

  goToDetails() {
    this.router.navigate([`catalogue/${this.data.fireData.id}`])
  }


  ngOnInit(): void {

  }

}
