import { Component } from '@angular/core';
import { Employee } from '../employee/model/Employee';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { Router } from '@angular/router';
import { HomeService } from './services/home.service';
import { AuthService } from '../login/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home', 
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  companyId = environment.companyId;
  employees:Employee[];
  company : any;
  constructor(private empserservice: EmployeeServiceService,
              private homeService: HomeService, 
              private router: Router,
              private auth : AuthService) {}

  async ngOnInit() {
    window.sessionStorage.removeItem("succ-reservs");
    window.sessionStorage.removeItem("employee");
    this.checkIfUserExist();
    this.checkIfCompanyExist();
    this.getEmpByCompanyId();
  }


  checkIfUserExist() {
    if(!this.auth.getToken() || !this.auth.getUser()!){
      this.router.navigate(['login'])
    }
  }

  checkIfCompanyExist() {
    if(!this.homeService.getCompany()){
        this.homeService.getCompanyById().subscribe(res => {
          if(res != null && res != undefined && res != ""){
            this.homeService.saveCompany(res);
          }
        })
    }
  }

  getEmpByCompanyId(){
    this.empserservice.getEmployeesByCompanyId(this.companyId).subscribe(res => {
      this.employees=res; 
    })
  }

  openBarber(emp){
    window.sessionStorage.removeItem("employee");
    window.sessionStorage.setItem("employee", JSON.stringify(emp));
    this.router.navigate(['employee', emp.userId])
  }

}
