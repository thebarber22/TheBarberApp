import { Component, OnInit } from '@angular/core';
import { EmployeeServiceService } from './employee/services/employee-service.service';
import { AuthService } from './login/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from './home/services/home.service';
import { Location } from '@angular/common';    
import { LoginService } from './login/services/login.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  constructor(private authService: AuthService,
              private empService: EmployeeServiceService) {
                this.checkCurrentUser();
              }
  showMenu:any=true;
  token : any = "";
  isUser = true;

  ngOnInit() {
   this.showMenu = this.empService.getMenuNotActive().subscribe(val => this.showMenu=val)
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
