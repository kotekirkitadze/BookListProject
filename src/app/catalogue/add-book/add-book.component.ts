import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { BookApiService } from '../services/book-api.services';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Status } from '../catalogue.model';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit, OnDestroy {

  starRating = faStar;
  searchData: string;
  errorVal: boolean;
  lastThreeSearches: string[] = [];
  form: FormGroup;
  status = Status;
  fb: FormBuilder;
  submitted: boolean = false;

 
  private unsubscribe$ = new Subject();

  submit(){
    this.submitted = true;
  }

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

  createForm() {
    this.form = new FormGroup({
      rating: new FormControl(3),
      review: new FormControl('', [Validators.required, 
                                   Validators.minLength(10)]),
      status: new FormControl(Status.WatchLater)
    });
  }

  ngOnInit(): void {
    this.restoreSearches();
    this.createForm();
  }

  ngOnDestroy(){
   
   }

  
}