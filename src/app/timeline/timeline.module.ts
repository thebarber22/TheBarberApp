import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TimelinePageRoutingModule } from './timeline-routing.module';
import { ReserveButtonComponent } from '../shared/reserve-button/reserve-button.component';
import { TimelinePage } from './timeline.page';
import { DatePipe } from './services/date.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    TimelinePageRoutingModule,
    TranslateModule
  ],
  
  declarations: [TimelinePage, DatePipe]
})
export class TimelinePageModule {}
