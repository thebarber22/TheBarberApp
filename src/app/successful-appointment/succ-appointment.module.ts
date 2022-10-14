import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SuccAppointmentPage } from './succ-appointment.page';
import { SuccAppointmentPageRoutingModule } from './succ-appointment-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SuccAppointmentPageRoutingModule,
    IonicModule, 
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [SuccAppointmentPage],
})
export class SuccAppointmentPageModule { }
