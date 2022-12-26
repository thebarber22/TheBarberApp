import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { AuthService } from '../login/services/auth.service';
import { TimelineService } from './services/timeline.service';
import { AlertController } from '@ionic/angular';

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
  firstInitialize: Boolean = false;

  constructor(private authService: AuthService,
              private timelineService : TimelineService,
              private employeeService : EmployeeServiceService,
              private fb: FormBuilder,
              private alertController: AlertController) { 
                this.selectForm = fb.group({
                  'empId' : ['', Validators.required],
                });
              }

  async ngOnInit() {
    console.log("hereee")
    let user;
    await this.authService.getUser().then((res)=>{
      user = JSON.parse(res)
    });
    console.log(user)
    if(user.roles == "ROLE_MODERATOR"){
      this.getEmployeeByCompanyId();
      this.showAdminPanel = true;
    } else {
      this.showAdminPanel = false;
      this.getTimeline(user.id);
    }
  }

  async ionViewDidEnter(){
    if(this.firstInitialize)
      await this.ngOnInit()
    else 
      this.firstInitialize=true;  
  }
  
  async removeAppointmentAlert(id) {
    const alert = await this.alertController.create({
      header: 'Внимание',
      message: 'Дали сте сигурни дека сакате да ја откажете резервацијата?',
      buttons: [{
          text: 'Да',
          role: 'confirm',
          handler: () => {
            this.removeAppointment(id)
          },
        },
    ],
    });

    await alert.present();
  }

  getEmployeeByCompanyId(){
    this.employeeService.getEmployeesByCompanyId(environment.companyId).subscribe(res => {
      if(res != null && res != undefined){
        this.employeeList = res;
      }
    })
  }
  
  async removeAppointment(id){
    this.timelineService.removeAppointments(id).subscribe(async res => {
      if(res != null && res != undefined){
        this.showAdminPanel = false;
        let user = await this.authService.getUser()
        this.getTimeline(user.id);
      }
    },err => console.log(err))
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
