import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private menuNotActive = new Subject<boolean>();

  constructor(private http: HttpClient) { }
  //Close menu when route is on employee page
  sendMenuNotActive(value:boolean){
    this.menuNotActive.next(value)
  }

  getMenuNotActive():Observable<boolean>{
    return this.menuNotActive.asObservable();
  }
  
}
