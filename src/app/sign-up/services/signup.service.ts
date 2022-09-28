import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  private url = environment.url;

  constructor(private http: HttpClient) { }

  finishRegistration(user:User){
    return this.http.post<any>(this.url + 'api/add', user)
  }

}
