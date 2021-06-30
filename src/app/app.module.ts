import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { ShellModule } from './shell/shell.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { SharedModule } from './shared-module/shared-module.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
export function TranslateHttpLoaderFactory(
  http: HttpClient
): TranslateHttpLoader {
  return new TranslateHttpLoader(http, 'assets/i18n/');
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ShellModule,
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: "en"
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
