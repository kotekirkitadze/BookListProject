import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from './loading/loading.component';
import { SpinnerComponent } from './loading/spinner/spinner.component';
import { MustMatchDirective } from './directives/must-match.directive';

@NgModule({
  declarations: [
    LoadingComponent,
    SpinnerComponent,
    MustMatchDirective,
  ],
  imports: [CommonModule],
  exports: [
    TranslateModule,
    LoadingComponent,
    MustMatchDirective,
  ],
})
export class SharedModule {}
