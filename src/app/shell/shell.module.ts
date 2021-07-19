import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared-module/shared-module.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    HeaderComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FontAwesomeModule,
  ],
  exports: [HeaderComponent],
})
export class ShellModule {}

//here we do not need to export notFoundComponent
//because its export/import is handled by router
