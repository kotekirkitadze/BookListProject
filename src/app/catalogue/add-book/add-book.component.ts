import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {

  searchedVal: string;
  errorVal: boolean;

  searchBook() {
    if (!this.searchedVal || this.searchedVal == " ") {
      this.errorVal = true;
      return;
    }
    this.errorVal = false;
    console.log(this.searchedVal)
  }

  constructor() { }

  ngOnInit(): void {
  }

}
