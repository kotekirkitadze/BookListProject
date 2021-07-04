import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { fireBookBody } from '../../catalogue.model';

@Component({
  selector: 'app-book-list-item',
  templateUrl: './book-list-item.component.html',
  styleUrls: ['./book-list-item.component.scss']
})
export class BookListItemComponent implements OnInit {

  @Input() data: any;
  @Output() deleteBtn = new EventEmitter();
  constructor(private router: Router) { }

  delete() {
    this.deleteBtn.emit("to delete book");
  }

  goToDetails() {
    this.router.navigate([`catalogue/${this.data.fireData.id}`])
  }

  ngOnInit(): void {
    console.log(this.data.fireData.id);
  }

}
