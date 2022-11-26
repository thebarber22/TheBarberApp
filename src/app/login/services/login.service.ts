import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/login/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url  = environment.url;

  constructor(private http: HttpClient) { }

  finishRegistration(user:User){
    return this.http.post<any>(this.url + '/api/add', user)
  }

  signUpNewUser(user:User){
    return this.http.post<any>(this.url + '/api/register/user', user)
  }
}
