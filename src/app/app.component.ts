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
              private location: Location,
              private empService: EmployeeServiceService) {}
  showMenu:boolean=true;
  token : any = "";
  deviceId : any = "";
  route = this.location.path();

  ngOnInit() {
    this.refreshCurrentUser();
    this.empService.getMenuNotActive().subscribe(val => this.showMenu=val)
  }

  goTo(value) {
    this.router.navigate([value])
  }

  refreshCurrentUser(){
    // this.authService.getCurrentUser().subscribe(data => { 
    //   if(data != null && data != undefined) {
    //     this.authService.saveUser(data);
    //   }
    // });
  }
}
