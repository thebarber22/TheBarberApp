import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuccAppointmentPage } from './succ-appointment.page';

const routes: Routes = [
  {
    path: '',
    component: SuccAppointmentPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuccAppointmentPageRoutingModule {}
