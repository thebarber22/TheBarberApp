import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpiredSubscriptionPage } from './expired-subscription.page';
const routes: Routes = [
  {
    path: '',
    component: ExpiredSubscriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpiredSubscriptionPageRoutingModule {}
