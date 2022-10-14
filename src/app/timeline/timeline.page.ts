import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { AuthService } from '../login/services/auth.service';
import { TimelineService } from './services/timeline.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {
  segment: string = "future";
  pastAppointmentsList = [];
  futureAppointmentsList = [];
  employeeList = [];
  showAdminPanel = false;
  selectForm: FormGroup;

  constructor(private authService: AuthService,
              private timelineService : TimelineService,
              private employeeService : EmployeeServiceService,
              private fb: FormBuilder) { 
                this.selectForm = fb.group({
                  'empId' : ['', Validators.required],
                });
              }


  ngOnInit() {
    if(this.authService.getUser().roles == "ROLE_MODERATOR"){
      this.getEmployeeByCompanyId();
      this.showAdminPanel = true;
    } else {
      this.showAdminPanel = false;
      this.getTimeline(this.authService.getUser().id);
    }
  }

  getEmployeeByCompanyId(){
    this.employeeService.getEmployeesByCompanyId(environment.companyId).subscribe(res => {
      if(res != null && res != undefined){
        this.employeeList = res;
      }
    })
  }

  changeEmpInSelect(){
    this.getTimeline(this.selectForm.controls["empId"].value)
  }

  getTimeline(userId){
      this.futureAppointmentsList = []
      this.pastAppointmentsList = [];

      this.timelineService.getTimeline(userId, "future").subscribe(res => {
        if(res != null && res != undefined){
          this.futureAppointmentsList = res;
        }
      },err => console.log(err))
    
      this.timelineService.getTimeline(userId, "past").subscribe(res => {
        if(res != null && res != undefined){
          this.pastAppointmentsList = res;
        }
      },err => console.log(err))
  }

  checkIfExist(value){
    if(value != null && value != ""){
      return true;
    } else {
      return false;
    }
  }
}
