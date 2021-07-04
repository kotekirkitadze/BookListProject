import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fireBookBody } from '../../catalogue.model';

@Component({
  selector: 'app-book-list-item',
  templateUrl: './book-list-item.component.html',
  styleUrls: ['./book-list-item.component.scss']
})
export class BookListItemComponent implements OnInit {

  @Input() data: any;

  constructor(private router: Router) { }


  goToDetails() {
    this.router.navigate([`catalogue/${this.data.fireData.id}`])
  }

  ngOnInit(): void {
    console.log(this.data.fireData.id);
  }

}
