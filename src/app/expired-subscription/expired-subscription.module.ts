import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExpiredSubscriptionPageRoutingModule } from './expired-subscription-routing.module';
import { ExpiredSubscriptionPage } from './expired-subscription.page';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpiredSubscriptionPageRoutingModule,
    TranslateModule
  ],
  declarations: [ExpiredSubscriptionPage],
  providers: [DatePipe]
})
export class ExpiredSubscriptionPageModule {}
