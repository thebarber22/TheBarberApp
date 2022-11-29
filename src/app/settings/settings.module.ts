import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LongPressModule } from 'ionic-long-press';
import { SettingsPage } from './settings.page';
import { SettingsPageRoutingModule } from './settings-routing.module';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    SettingsPageRoutingModule,
    LongPressModule,
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
