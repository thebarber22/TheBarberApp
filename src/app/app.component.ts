import { Component, OnInit } from '@angular/core';
import { EmployeeServiceService } from './employee/services/employee-service.service';
import { AuthService } from './login/services/auth.service';
import { Router } from '@angular/router';
import { HomeService } from './home/services/home.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  constructor(private homeService: HomeService,
              private authService: AuthService,
              private router: Router) {}
  showMenu:boolean=true;
  token : any = "";
  deviceId : any = "";
  ngOnInit() {
    this.homeService.getMenuNotActive().subscribe(val => this.showMenu=val)
    console.log(this.showMenu)
  } 
}
