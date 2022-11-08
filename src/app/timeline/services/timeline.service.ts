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

  getTimeline(userId, type){
    return this.http.get<any>(this.url + '/reservation/get-timeline/'+userId+"/"+type).pipe(map(response => {
        return response;
    }))
  }

  getTimelineEmployee(userId, dateSelected){
    console.log(dateSelected)
    return this.http.get<any>(this.url + '/reservation/get-timeline-emp/'+userId+"/"+dateSelected).pipe(map(response => {
        return response;
    }))
  }

  deleteAppointment(id){
    console.log(id)
    return this.http.delete<any>(this.url + '/reservation/delete/'+id).pipe(map(response => {
        return response;
    }))
  }
}
