import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/login/models/User';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/internal/operators/map';
import { Employee } from 'src/app/employee/model/Employee';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  url  = environment.url;

  constructor(private http: HttpClient) { }

  getTimeline(userId, type, language){
    let queryParams = {"lang":language};
    return this.http.get<any>(this.url + 'user/get-timeline/'+userId+"/"+type, {params:queryParams}).pipe(map(response => {
        return response;
    }))
  }

  getTimelineEmployee(userId, dateSelected, language){
    let queryParams = {"lang":language};
    return this.http.get<any>(this.url + 'user/get-timeline-emp/'+userId+"/"+dateSelected, {params:queryParams}).pipe(map(response => {
        return response;
    }))
  }

  removeAppointments(appointmentId){
    return this.http.delete<any>(this.url + 'user/delete/'+appointmentId).pipe(map(response => {
        return response;
    }))
  }

  getAppointmentById(appointmentId){
    return this.http.get<any>(this.url + 'user/appointments/'+appointmentId).pipe(map(response => {
        return response;
    }))
  }
}
