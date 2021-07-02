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
import { FireApiService, BOOK_API, BookApiService } from './services/index';


@NgModule({
  declarations: [
    CatalogueComponent,
    AddBookComponent,
    UserComponent,
    BookListComponent,
    BookListItemComponent
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
  providers: [BookApiService, FireApiService, {
    provide: BOOK_API,
    useValue: environment.bookApi
  }]
})
export class CatalogueModule { }
