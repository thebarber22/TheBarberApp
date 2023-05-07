import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { authInterceptorProviders } from './login/services/auth.interceptor';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicGestureConfig } from '../shared/utils/IonicGestureConfig';
import { IonicStorageModule } from '@ionic/storage-angular';
import { DatePipe } from './timeline/services/date.pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SignInWithApple } from "@ionic-native/sign-in-with-apple/ngx";

@NgModule({
  declarations: [AppComponent],
  imports: [
    IonicStorageModule.forRoot(),
    CommonModule,
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient]
      }
    })
    ],
  // eslint-disable-next-line max-len
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, authInterceptorProviders, {provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig}, DatePipe, SignInWithApple],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppModule {}
