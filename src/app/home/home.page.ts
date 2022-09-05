import { Component } from '@angular/core';
import { Employee } from '../employee/model/Employee';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  employees:Employee[];
  constructor(private empserservice: EmployeeServiceService, private router: Router) {}

  async ngOnInit() {
    this.empserservice.sendMenuNotActive(true)
    
    this.empserservice.getEmployeesByCompanyId(1).subscribe(res => {
      console.log(res)
      this.employees=res;
    })
  }

  openBarber(emp){
    this.router.navigate(['employee', emp.userId])
  }
}
