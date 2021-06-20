import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'myBookProject';

  constructor(private loadingService: LoadingService) { }

  //getterit bevrjer idzaxebso da magitom ar mushaobda
  //raghac change deteqshenis temaa
  loadingSpinner: Observable<boolean>;

  ngOnInit() {

    this.loadingSpinner = this.loadingService.getLoading$;

  }
}
