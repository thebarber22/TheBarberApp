import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/internal/operators/map';
import { Employee } from '../model/Employee';
import { Service } from '../model/Service';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  private url = environment.url;

  constructor(private http: HttpClient) { }


  getEmployeesByCompanyId(id) {
    return this.http.get<Employee[]>(this.url + "/api/company/" + id).pipe(map(response => {
      return response;
    }))
  }
 
  getServicesByEmployee(id) {
    return this.http.get<Service[]>(this.url + "employee-services/" + id).pipe(map(response => {
      return response;
    }))
  }
}
