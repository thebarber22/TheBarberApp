import { Component } from '@angular/core';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HomeService } from '../home/services/home.service';
import { FormBuilder, FormGroup , Validators , FormControl } from "@angular/forms";
import { environment } from 'src/environments/environment';
import { Device } from '@capacitor/device';
import { AuthService } from '../login/services/auth.service';


@Component({
  selector: 'app-succ-appointment',
  templateUrl: 'succ-appointment.page.html',
  styleUrls: ['succ-appointment.page.scss'],
})
export class SuccAppointmentPage {
  startDateTime;
  servicesName;
  employeeName;
  constructor(private router: Router) {} 

  async ngOnInit() { 
   let emp = JSON.parse(sessionStorage.getItem("succ-reservs"));
  
   this.startDateTime = emp.startDateTime;
   this.servicesName = emp.serviceList[0].name;
   this.employeeName = emp.employeeId
  }


  continue(){
    window.sessionStorage.removeItem("succ-reservs");
    window.sessionStorage.removeItem("employee");
    this.router.navigate(["/home"]);
  }
 
}
 
