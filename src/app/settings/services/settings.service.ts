import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/login/constants/app.constants';
import { User } from 'src/app/login/models/User';
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

}
