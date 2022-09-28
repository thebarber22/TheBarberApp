import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignUpPageRoutingModule } from './signup-routing.module';
import { SignupPage } from './signup.page';


@NgModule({
  imports: [
    CommonModule,
    SignUpPageRoutingModule,
    IonicModule, 
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [SignupPage],
})
export class SignupPageModule { }
