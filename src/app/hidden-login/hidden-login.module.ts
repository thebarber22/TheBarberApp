import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './hidden-login-routing.module';
import { HiddenLoginPage } from './hidden-login.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,  
    TranslateModule
  ],
  declarations: [HiddenLoginPage],
})
export class HiddenLoginPageModule { }
