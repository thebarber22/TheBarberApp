import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LocationPageRoutingModule } from './location-routing.module';
import { LocationPage } from './location.page';
import { SafePipe } from './safe.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    IonicModule, 
    ReactiveFormsModule,
    FormsModule,
    LocationPageRoutingModule,
    TranslateModule
  ],
  declarations: [LocationPage, SafePipe],
})
export class LocationModule { }
