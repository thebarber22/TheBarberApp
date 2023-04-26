import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/login/models/User';
import { environment } from 'src/environments/environment';
import { MediaLoginDTO } from '../models/MediaLoginDTO';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url  = environment.url;

  constructor(private http: HttpClient) { }

  finishRegistration(user:User){
    return this.http.post<any>(this.url + 'public/finish-registration', user)
  }

  signUpNewUser(user:User){
    return this.http.post<any>(this.url + 'public/new-user', user)
  }

  createSocialMediaLogin(loginDTO:MediaLoginDTO) {
    return this.http.post<any>(this.url + 'public/create-social-login', loginDTO)
  }

  checkIfEmailExist(email: any, company:any) {
    let queryParams = {"company":company};
    return this.http.get<any>(this.url + 'api/auth/email-exist/' + email, {params:queryParams})
  }

}
