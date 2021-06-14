import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ResetPasswComponent } from './reset-passw/reset-passw.component';



@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    ResetPasswComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModuleModule,
    FormsModule
  ]
})
export class AuthModule { }
