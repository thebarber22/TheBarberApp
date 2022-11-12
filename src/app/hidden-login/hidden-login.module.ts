import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './hidden-login-routing.module';
import { HiddenLoginPage } from './hidden-login.page';

@NgModule({
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,  
  ],
  declarations: [HiddenLoginPage],
})
export class HiddenLoginPageModule { }
