import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { MediaLoginDTO } from "src/app/login/models/MediaLoginDTO";
import { User } from "src/app/login/models/User";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class HiddenLoginService {
    url  = environment.url;
  
    constructor(private http: HttpClient) { }
  
    hiddenLogin(userDTO:User){
      return this.http.post<any>(this.url + 'api/auth/signin', userDTO).pipe(map(response => {
          return response;
      }))
    }

    resetPass(email){
      return this.http.get<any>(this.url + 'public/reset-password/' + email).pipe(map(response => {
          return response;
      }))
    }

    socialMediaLogin(socialMediaLogin:MediaLoginDTO){
      return this.http.post<any>(this.url + 'public/social-media-login', socialMediaLogin).pipe(map(response => {
        return response;
      }))
    }
  }
  