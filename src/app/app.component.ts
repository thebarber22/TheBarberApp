import { Component, OnInit } from '@angular/core';
import { EmployeeServiceService } from './employee/services/employee-service.service';
import { AuthService } from './login/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from './home/services/home.service';
import { Location } from '@angular/common';    


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  constructor(private homeService: HomeService,
              private authService: AuthService,
              private router: Router,
              private location: Location) {}
  showMenu:boolean=true;
  token : any = "";
  deviceId : any = "";
  route = this.location.path();

  ngOnInit() {
    this.checkShowMenu();
  } 
   
  checkShowMenu(){
    if(this.route === "/login" || this.route === "/signup" || this.route.toString().includes("employee/")){
      this.showMenu = false;
    } else {
      this.showMenu = true;
    }
  }
}
