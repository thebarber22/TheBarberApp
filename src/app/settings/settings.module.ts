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
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    LongPressModule,
    ReactiveFormsModule,
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
