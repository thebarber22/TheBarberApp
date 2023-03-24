import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from './login/services/auth.service';
import { Router, NavigationEnd  } from '@angular/router';
import { HomeService } from './home/services/home.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { isPlatform } from '@ionic/angular';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService,
              private _router:Router,
              private zone: NgZone,
              private homeService: HomeService,
              private translate: TranslateService) {
                this.translate.setDefaultLang('mk');
              }
  showMenu:any=false;
  notifications: PushNotificationSchema[] = [];
  token : any = "";
  isUser = true;
  closed$ = new Subject<any>();
  ngOnInit() {
    this._router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.closed$)
    ).subscribe(event => {
      if(event["url"].includes("home") || event["url"].includes("settings") || event["url"].includes("location") || event["url"].includes("timeline") || event["url"].includes("scheduler")) {
        this.showMenu = true;
      } else {
        this.showMenu = false;
      }

      if(event["url"].includes("home")){
        this.checkCurrentUser();
      }
    });

    if(isPlatform('capacitor')){
      this.firebaseConfiguration();
    }
  }

  ngOnDestroy() {
    this.closed$.next(); // <-- close subscription when component is destroyed
  }
  
  async checkCurrentUser(){
    setTimeout(async () => {  
      await this.authService.getUser().then(res => {
        let user = JSON.parse(res)
        if(user != null && user.roles != null) {
          if(!user.roles.includes("ROLE_USER")){
            this.isUser = false;
          } else {
            this.isUser = true;
          }
        }
      })
    }, 100);
  }

  firebaseConfiguration(){
    PushNotifications.addListener('registration', (data) => {
      console.log(data);
    });
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('notification ' + JSON.stringify(notification));
        this.zone.run(() => {
          this.homeService.setData("newNotification");
          this.notifications.push(notification);
        });
      }
    );
    
    PushNotifications.requestPermissions().then((response) =>
      PushNotifications.register().then(() => console.log(`registered for push`))
    );

    FCM.getToken()
      .then((result) => {
        this.authService.saveFirebaseToken(result.token);
      })
      .catch((err) => console.log(err));
  }

  
}
