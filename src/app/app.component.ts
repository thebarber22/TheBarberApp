import { Component, OnInit } from '@angular/core';
import { EmployeeServiceService } from './employee/services/employee-service.service';
import { AuthService } from './login/services/auth.service';
import { ActivatedRoute, Router, NavigationEnd  } from '@angular/router';
import { HomeService } from './home/services/home.service';
import { Location } from '@angular/common';    
import { LoginService } from './login/services/login.service';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  constructor(private authService: AuthService,
              private empService: EmployeeServiceService,
              private _router:Router) {}
  showMenu:any=false;
  token : any = "";
  isUser = true;
  closed$ = new Subject<any>();
  ngOnInit() {
    this._router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.closed$)
    ).subscribe(event => {
      if(event["url"].includes("home") || event["url"].includes("settings") || event["url"].includes("location") || event["url"].includes("timeline") || event["url"].includes("scheduler")) {
        this.showMenu = true;
      } else {
        this.showMenu = false;
      }

      if(event["url"].includes("home")){
        this.checkCurrentUser();
      }
    });
  }
  ngOnDestroy() {
    this.closed$.next(); // <-- close subscription when component is destroyed
  }
  async checkCurrentUser(){
    setTimeout(async () => {  
      await this.authService.getUser().then(res => {
        let user = JSON.parse(res)
        if(user != null && user.roles != null) {
          if(!user.roles.includes("ROLE_USER")){
            this.isUser = false;
          } else {
            this.isUser = true;
          }
        }
      })
    }, 100);
  }

  
}
