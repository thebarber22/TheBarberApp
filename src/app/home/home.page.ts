import { ChangeDetectorRef, Component } from '@angular/core';
import { Employee } from '../employee/model/Employee';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { HomeService } from './services/home.service';
import { AuthService } from '../login/services/auth.service';
import { environment } from 'src/environments/environment';
import { Route, Router } from '@angular/router';
import {ActionPerformed, PushNotifications} from '@capacitor/push-notifications';
import {FCM} from '@capacitor-community/fcm';
import {ActionPerformed as LocalActionPerformed, LocalNotifications} from '@capacitor/local-notifications';

@Component({
  selector: 'app-home', 
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  companyId = environment.companyId;
  employees:Employee[];
  company : any;
  allowPush = true;
  private readonly TOPIC_NAME = 'chuck';
  items: { id: number, text: string }[] = [];

  constructor(private empserservice: EmployeeServiceService,
              private homeService: HomeService, 
              private router: Router,
              private auth : AuthService,
              private readonly changeDetectorRef: ChangeDetectorRef) {}

  async ngOnInit() {
    window.sessionStorage.removeItem("succ-reservs");
    window.sessionStorage.removeItem("employee");
    this.checkIfUserExist();
    this.checkIfCompanyExist();
    this.getEmpByCompanyId();
    this.initFCM().then(() => {
      this.onChange();
    });
  }


  checkIfUserExist() {
    if(!this.auth.getToken() || !this.auth.getUser()!){
      this.router.navigate(['login'])
    }
  }

  checkIfCompanyExist() {
    if(!this.homeService.getCompany()){
        this.homeService.getCompanyById().subscribe(res => {
          if(res != null && res != undefined && res != ""){
            this.homeService.saveCompany(res);
          }
        })
    }
  }

  getEmpByCompanyId(){
    this.empserservice.getEmployeesByCompanyId(this.companyId).subscribe(res => {
      this.employees=res; 
    }
  }


  onChange(): void {
    localStorage.setItem('allowPush', JSON.stringify(this.allowPush));

    if (this.allowPush) {
      FCM.subscribeTo({topic: this.TOPIC_NAME});
    } else {
      FCM.unsubscribeFrom({topic: this.TOPIC_NAME});
    }
  }

  openBarber(emp){
    window.sessionStorage.removeItem("employee");
    window.sessionStorage.setItem("employee", JSON.stringify(emp));
    this.router.navigate(['employee', emp.userId])
  }

  private async initFCM(): Promise<void> {
    await PushNotifications.requestPermissions();

    PushNotifications.addListener('registrationError',
      error => console.log('Error on registration: ' + JSON.stringify(error)));

    // Only called when app in foreground
    PushNotifications.addListener('pushNotificationReceived',
      notification => {
        this.handleNotification(notification.data);

        LocalNotifications.schedule({
          notifications: [{
            title: notification.title ?? '',
            body: notification.body ?? '',
            id: Date.now(),
            extra: notification.data,
            smallIcon: 'res://ic_stat_name'
          }]
        });
      }
    );

    // called when app in background and user taps on notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (event: ActionPerformed) => {
        this.handleNotification(event.notification.data);
      }
    );

    // called when app in foreground and user taps on local notification
    LocalNotifications.addListener('localNotificationActionPerformed',
      (event: LocalActionPerformed) => {
        this.handleNotification(event.notification.extra);
      });

  }

  handleNotification(data: { text: string, id: number }): void {
    if (!data.text) {
      return;
    }

    this.items.splice(0, 0, {id: data.id, text: data.text});

    // only keep the last 5 entries
    if (this.items.length > 5) {
      this.items.pop();
    }

    this.changeDetectorRef.detectChanges();
  }
}
