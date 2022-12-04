import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from 'src/app/employee/model/Service';
import { AppConstants } from 'src/app/login/constants/app.constants';
import { User } from 'src/app/login/models/User';
import { CompanyDTO } from 'src/app/shared/models/CompanyDTO';
import { MailDTO } from 'src/app/shared/models/MailDTO';
import { PasswordDTO } from 'src/app/shared/models/passwordDTO';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  obj : any;
  url  = environment.url;

  constructor(private http: HttpClient) { }
 

  public updateUser(user:User){
    return this.http.post(this.url + '/api/update-user', user);
  }

  public changePassword(password:PasswordDTO){
    return this.http.post(this.url + '/api/change-password', password);
  }

  public removeMyProfile(userId){
    return this.http.get(this.url + '/api/remove-user/' + userId);
  }

  public sendMessage(mailDTO: MailDTO){
    return this.http.post(this.url + '/api/send-message', mailDTO);
  }

  public removeServiceFromEmp(serviceId, userId){
    return this.http.get(this.url + '/service/remove-service/' + serviceId + '/' + userId);
  }

  public removeServiceFromCompany(serviceId){
    return this.http.get(this.url + '/service/remove-service/' + serviceId);
  }


  public addServiceToEmp(serviceId, userId){
    return this.http.get(this.url + '/service/add-service/' + serviceId + '/' + userId);
  }

  public getServicesByCompany(id) {
    return this.http.get<Service[]>(this.url + "/company/service/" + id).pipe(map(response => {
      return response;
    }))
  }

  public createNewService(serviceDTO: Service){
    return this.http.post(this.url + '/service/add', serviceDTO);
  }

  public updateService(serviceDTO: Service){
    return this.http.put(this.url + '/service/add', serviceDTO);
  }

  public getServiceDetails(serviceId) {
    return this.http.get<any>(this.url + "/service/details/" + serviceId).pipe(map(response => {
      return response;
    }))
  }
  

  public getServiceImages(companyType) {
    return this.http.get<any>(this.url + "/company/service-images/" + companyType).pipe(map(response => {
      return response;
    }))
  }

    public updateCompany(companyDTO : CompanyDTO) {
    return this.http.put<any>(this.url + "/company/edit", companyDTO).pipe(map(response => {
      return response;
    }))
  }

}
