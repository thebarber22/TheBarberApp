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
  constructor(private homeService: HomeService,
              private authService: AuthService,
              private loginService: LoginService,
              private router: Router,
              private location: Location,
              private empService: EmployeeServiceService) {}
  showMenu:boolean=true;
  token : any = "";
  deviceId : any = "";
  route = this.location.path();
  isUser = true;

  ngOnInit() {
    this.checkCurrentUser();
    this.empService.getMenuNotActive().subscribe(val => this.showMenu=val)
  }

  async checkCurrentUser(){
    let user = await this.authService.getUser();
    if(user != null && !user.roles.includes("ROLE_USER")){
      this.isUser = false;
    }
  }
}
