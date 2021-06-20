import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogueComponent } from './catalogue.component';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { AddBookComponent } from './add-book/add-book.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CatalogueComponent,
    AddBookComponent
  ],
  imports: [
    CommonModule,
    CatalogueRoutingModule,
    FormsModule
  ]
})
export class CatalogueModule { }
