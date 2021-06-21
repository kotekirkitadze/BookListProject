import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from './loading/loading.component';
import { SpinnerComponent } from './loading/spinner/spinner.component';


@NgModule({
  declarations: [
    LoadingComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [TranslateModule, LoadingComponent]
})
export class SharedModule { }
