import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogueComponent } from './catalogue.component';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { AddBookComponent } from './add-book/add-book.component';
import { FormsModule } from '@angular/forms';
import { BOOK_API, BookApiService } from './services/book-api.services';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../shared-module/shared-module.module';



@NgModule({
  declarations: [
    CatalogueComponent,
    AddBookComponent
  ],
  imports: [
    CommonModule,
    CatalogueRoutingModule,
    FormsModule,
    SharedModule
  ],
  providers: [BookApiService, {
    provide: BOOK_API,
    useValue: environment.bookApi
  }]
})
export class CatalogueModule { }
