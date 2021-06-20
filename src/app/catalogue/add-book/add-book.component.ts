import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { BookApiService } from '../services/book-api.services';

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

    this.loadingService.start();
    this.apiService.getBookByName(this.searchedVal).pipe(finalize(()=> {
      this.loadingService.stop();
    })).subscribe((x)=>console.log(x))
  }

  constructor( private loadingService: LoadingService, 
              private apiService: BookApiService) { }

  ngOnInit(): void {
  }

}
