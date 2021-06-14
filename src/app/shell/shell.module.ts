import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
  declarations: [
    HeaderComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule,
  ],
  exports: [HeaderComponent]
})
export class ShellModule { }

//here we do not need to export notFoundComponent
//because its export/import is handled by router
