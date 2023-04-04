import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { AuthService } from '../login/services/auth.service';
import { TimelineService } from './services/timeline.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  selectedLang: any;
  firstInitialize: Boolean = false;
  user : any;
  constructor(private authService: AuthService,
              private timelineService : TimelineService,
              private employeeService : EmployeeServiceService,
              private fb: FormBuilder,
              private alertController: AlertController,
              private router: Router,
              private translate: TranslateService) { 
                this.selectForm = fb.group({
                  'empId' : ['', Validators.required],
                });
              }

  async ngOnInit() {
    this.checkDefaultLanguage();
    await this.authService.getUser().then((res)=>{
      this.user = JSON.parse(res)
    });
    if(this.user.roles == "ROLE_MODERATOR"){
      this.getEmployeeByCompanyId();
      this.showAdminPanel = true;
    } else {
      this.showAdminPanel = false;
      this.getTimeline(this.user.id);
    }
  }


  checkDefaultLanguage(){
    this.authService.getLanguage().then(lang => {
      if(lang != null && lang != undefined && lang != ""){
        this.selectedLang = lang;
      } else {
        this.selectedLang = this.translate.getDefaultLang()
      }
    });    
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
        this.getTimeline(this.user.id);
      }
    },err => this.router.navigate(['error']))
  }

  changeEmpInSelect(){
    this.getTimeline(this.selectForm.controls["empId"].value)
  }

  getTimeline(userId){
      this.futureAppointmentsList = []
      this.pastAppointmentsList = [];

      this.timelineService.getTimeline(userId, "future", this.selectedLang).subscribe(res => {
        if(res != null && res != undefined){
          this.futureAppointmentsList = res;
        }
      },err => this.router.navigate(['error']))
    
      this.timelineService.getTimeline(userId, "past", this.selectedLang).subscribe(res => {
        if(res != null && res != undefined){
          this.pastAppointmentsList = res;
        }
      },err => this.router.navigate(['error']))
  }

  checkIfExist(value){
    if(value != null && value != ""){
      return true;
    } else {
      return false;
    }
  }

  startDate(value){
    alert(value);
  }
}
