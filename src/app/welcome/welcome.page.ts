import { Component, NgZone, OnInit} from '@angular/core';
import { AuthService } from '../login/services/auth.service';
import { isPlatform, Platform } from '@ionic/angular';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  notifications: PushNotificationSchema[] = [];
  topicName = 'TestTopic1';
  remoteToken = "";
  isModalOpen = false;
  token:any;
  user:any;

 constructor(private platform: Platform,
             private zone: NgZone,
             private router: Router,
             private authService: AuthService){}

  ngOnInit() {
    if(isPlatform('capacitor')){
      this.firebaseConfiguration();
    }

    this.checkUser();
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
          this.notifications.push(notification);
        });
      }
    );
    PushNotifications.requestPermissions().then((response) =>
      PushNotifications.register().then(() => console.log(`registered for push`))
    );
  }


//   // move to fcm demo
//   subscribeTo() {
//     PushNotifications.register()
//       .then((_) => {
//         FCM.subscribeTo({ topic: this.topicName })
//           .then((r) => alert(`subscribed to topic ${this.topicName}`))
//           .catch((err) => console.log(err));
//       })
//       .catch((err) => alert(JSON.stringify(err)));
//   }

//   unsubscribeFrom() {
//     FCM.unsubscribeFrom({ topic: this.topicName })
//       .then((r) => alert(`unsubscribed from topic ${this.topicName}`))
//       .catch((err) => console.log(err));

//     if (this.platform.is('android')) {
//       FCM.deleteInstance();
//     }
//   }

//   getToken() {
//     FCM.getToken()
//       .then((result) => {
//         this.remoteToken = result.token;
//       })
//       .catch((err) => console.log(err));
//   }
    

// }

  async goToLogin(){
    this.authService.saveFirebaseToken("test");
    this.router.navigate(["/login"]);
  }

  async checkUser(){
    await this.authService.getToken().then(res => {
      this.token = res;
    })
    await this.authService.getUser().then(res => {
      this.user = res;
    })
    setTimeout(() => {  
      if(this.token != null && this.user != null){
        this.router.navigate(['home'])
     }
    }, 300);
  }
}
