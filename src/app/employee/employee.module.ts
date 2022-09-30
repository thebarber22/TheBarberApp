import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeePageRoutingModule } from './employee-routing.module';

import { EmployeePage } from './employee.page';

import { ReserveButtonComponent } from '../shared/reserve-button/reserve-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeePageRoutingModule
  ],
  declarations: [EmployeePage, ReserveButtonComponent]
})
export class EmployeePageModule {}
