import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HiddenLoginPage } from './hidden-login.page';

const routes: Routes = [
  {
    path: '',
    component: HiddenLoginPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginPageRoutingModule {}
