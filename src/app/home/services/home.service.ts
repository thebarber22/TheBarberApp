import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const COMPANY_KEY = 'auth-company';
const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url = environment.url;

  constructor(private http: HttpClient) { }

  public saveCompany(company): void {
    window.sessionStorage.removeItem(COMPANY_KEY);
    window.sessionStorage.setItem(COMPANY_KEY, JSON.stringify(company));
  }

  public getCompany(): any {
    return JSON.parse(sessionStorage.getItem(COMPANY_KEY));
  }

  public getCompanyById(): any {
    return this.http.get<any>(this.url + "/company/" + environment.companyId).pipe(map(response => {
      return response;
    }))
  }
}
