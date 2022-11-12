import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { User } from "src/app/login/models/User";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class HiddenLoginService {
    url  = environment.url;
  
    constructor(private http: HttpClient) { }
  
    hiddenLogin(userDTO:User){
      return this.http.post<any>(this.url + '/api/hidden-login', userDTO).pipe(map(response => {
          return response;
      }))
    }
  }
  