import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Employee } from '../model/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  apiURL = environment.url;

  constructor(
    private http: HttpClient) { }


    getEmployees(companyId:Number) {
      return this.http.get(this.apiURL + 'employee/company/'+companyId)
        .pipe(map(response => {
          console.log(response)
          return response as Employee[];
      }))
    }
}
