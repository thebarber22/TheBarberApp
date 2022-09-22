import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { LoginPageRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    FormsModule,
    IonicModule, 
    
  ],
  declarations: [LoginPage],
})
export class LoginPageModule { }
