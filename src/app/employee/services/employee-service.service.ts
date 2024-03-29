import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/internal/operators/map';
import { Employee } from '../model/Employee';
import { Service } from '../model/Service';
import { Subject, Observable } from 'rxjs';
import { AppointmentsService } from '../model/AppointmentsService';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  private url = environment.url;
  private menuNotActive = new Subject<boolean>();

  constructor(private http: HttpClient) { }


  getEmployeesByCompanyId(id) {
    return this.http.get<Employee[]>(this.url + "user/company/" + id).pipe(map(response => {
      return response;
    }))
  }

  getServicesByEmployee(id) {
    return this.http.get<Service[]>(this.url + "user/employee-services/" + id).pipe(map(response => {
      return response;
    }))
  }

  getFreeSlotsByEmployee(userId, date, services, weekday){
    for(let i=0;i<services.length;i++){
      delete services[i].selected
    }
    const params= {
      employeeId: userId,
      date: date,
      services: services,
      weekday: weekday
    }
    return this.http.post<any>(this.url + "user/getFreeSlots", {employeeId: userId, date: date, services: services, weekday: weekday}).pipe(map(response => {
      return response;
    }))
  }

  makeReservation(appointment:AppointmentsService){
    return this.http.post<any>(this.url + "user/reserve", appointment ).pipe(map(response => {
      return response;
    }))
  }
}
 