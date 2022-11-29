import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private url = environment.url;

  constructor(private http: HttpClient) { }

  public getCompanyById(): any {
    return this.http.get<any>(this.url + "/company/" + environment.companyId).pipe(map(response => {
      return response;
    }))
  }
}
