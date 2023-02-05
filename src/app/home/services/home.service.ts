import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { DatePipe} from '@angular/common';
import { Storage } from '@ionic/storage-angular';

const NOTIFICATION_STORAGE = 'notification';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  datePipe = new DatePipe('en-US');

  private url = environment.url;
  private sharedData: Subject<any> = new Subject<any>();
  sharedData$: Observable<any> = this.sharedData.asObservable();


  constructor(private http: HttpClient,
              private _storage:Storage) { }

  public getCompanyById(): any {
    return this.http.get<any>(this.url + "public/company/" + environment.companyId).pipe(map(response => {
      return response;
    }))
  }

  public getCompanyDetails(): any {
    return this.http.get<any>(this.url + "public/company-details").pipe(map(response => {
      return response;
    }))
  }

  public getAllNotifications(): any {
    return this.http.get<any>(this.url + "user/get-notification").pipe(map(response => {
      return response;
    }))
  }


  public changeNotificationStatus(): any {
    return this.http.get<any>(this.url + "user/change-notification-status").pipe(map(response => {
      return response;
    }))
  }

  public removeNotifications(notificationId: any): any {
    const url = this.url + "user/remove-notification";
    let queryParams = {"notificationId":notificationId};
    return this.http.get<any>(url,{params:queryParams}).pipe(map(response => {
      return response;
    }))
  }

  setData(updatedData) {
    this.sharedData.next(updatedData);
  }
}
