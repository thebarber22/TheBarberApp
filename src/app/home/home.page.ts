import { Component } from '@angular/core';
import { Employee } from '../employeeservices/model/Employee';
import { EmployeeServiceService } from '../employeeservices/service/emeployeeservice.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  employees:Employee[];
  constructor(private empserservice: EmployeeServiceService) {}

  async ngOnInit() {

    this.empserservice.getEmployees(2).subscribe(res => {
      console.log(res)
      this.employees=res;
    })
  }
}
