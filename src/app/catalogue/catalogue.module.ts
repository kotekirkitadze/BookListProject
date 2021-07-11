import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogueComponent } from './catalogue.component';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { AddBookComponent } from './add-book/add-book.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../shared-module/shared-module.module';
import { UserComponent } from './user/user.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BookListComponent, BookListItemComponent } from './book-list/index';
import { FireCollectionApiService, BOOK_API, MOVIE_API, COUNTRY_API, BookApiService } from './services/index';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookInfoComponent } from './add-book/book-info/book-info.component';
import { AddBookService } from './services/add-book.service';


@NgModule({
  declarations: [
    CatalogueComponent,
    AddBookComponent,
    UserComponent,
    BookListComponent,
    BookListItemComponent,
    BookDetailsComponent,
    BookInfoComponent
  ],
  imports: [
    CommonModule,
    CatalogueRoutingModule,
    FormsModule,
    SharedModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BookApiService, AddBookService, FireCollectionApiService, {
    provide: BOOK_API,
    useValue: environment.bookApi
  },
    {
      provide: MOVIE_API,
      useValue: environment.movieApi
    },
    {
      provide: COUNTRY_API,
      useValue: environment.countryApi
    }]
})
export class CatalogueModule { }
