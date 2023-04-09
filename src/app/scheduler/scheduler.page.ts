import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { modalController } from '@ionic/core';
import { TimelineService } from '../timeline/services/timeline.service';
import { AuthService } from '../login/services/auth.service';
import { EmployeeServiceService } from "../employee/services/employee-service.service";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.page.html',
  styleUrls: ['./scheduler.page.scss'],
})
export class SchedulerPage implements OnInit {
  days={
    "1" : "monday",
    "2" : "tuesday",
    "3" : "wednesday",
    "4" : "thursday",
    "5" : "friday",
    "6" : "saturday",
    "0" : "sunday",
  }
  companyId = environment.companyId;
  appointmentsList = [];
  selectedDate:string=new Date(Date.now()).toISOString();
  selectedDateFormatted:string;
  selectedEmployee:any;
  selectedServices:any;
  employees:any=[];
  loading:Boolean=false;
  startHour:Number=9;
  startMinute:Number=0;
  endHour:Number=18;
  endMinute:Number=0;
  timeStamps:any=[];
  matrix: any;
  selectedAppointment: any;
  endDateTime:any;
  isOpen = false;
  id;
  selectedLang: any;
  firstInitialize: Boolean = false;
  constructor(private animationCtrl: AnimationController,
    private timelineService : TimelineService,
    private authService: AuthService,
    private empService: EmployeeServiceService,
    private router: Router,
    private translate: TranslateService) { }

  async ngOnInit() {
    const date = this.selectedDate.split("T")[0]
    this.selectedDateFormatted = date;
    this.getEmployees()
    this.checkDefaultLanguage();
  }

  async ionViewDidEnter(){
    if(this.firstInitialize)
      await this.ngOnInit()
    else 
      this.firstInitialize=true;  
  }


  async checkDefaultLanguage(){
    await this.authService.getLanguage().then(lang => {
      if(lang != null && lang != undefined && lang != ""){
        this.selectedLang = lang;
        this.translate.use(lang);
      } else {
        this.selectedLang = this.translate.getDefaultLang()
        this.translate.use(this.translate.getDefaultLang());
      }
    });    
  }

  getEmployees(){
    this.loading=true;
    this.empService.getEmployeesByCompanyId(this.companyId).subscribe(res => {
      this.employees=res;
    },()=>{this.loading=false; this.router.navigate(['error'])}, async ()=> {
      await this.authService.getUser().then(user => {
        for(let i = 0; i < this.employees.length; i++){
         if(this.employees[i].userId == JSON.parse(user).id){
          this.selectEmployee(this.employees[i])
          this.loading = false;
          return;
         }
        }
      })
      this.loading=false;
    })
  }

  selectDate(event){
    const date = event.split("T")[0]
    this.selectedDateFormatted = date;
    this.selectedDate=event;
    this.selectEmployee(this.selectedEmployee)
    modalController.dismiss()
  }


  getTimeline(userId){
    this.appointmentsList = [];
  
    this.timelineService.getTimelineEmployee(userId, this.selectedDateFormatted, this.selectedLang).subscribe(res => {
      if(res != null && res != undefined){
        this.appointmentsList = res;
      }
    },err => this.router.navigate(['error']),()=>{
      let id = 0;
      this.matrix=[]
      for(let i of this.timeStamps){
        this.matrix.push([i, {'filled': false}])
      }
      for(let item of this.appointmentsList){
        let splitedDate = item.startDate.split("-")
        let splitedTime = item.startTime.split(":")
        let startDate:Date = new Date(
          parseInt(splitedDate[0]),
          parseInt(splitedDate[1]),
          parseInt(splitedDate[2]),
          parseInt(splitedTime[0]),
          parseInt(splitedTime[1])
        )

        let endDate:Date = new Date(
          parseInt(splitedDate[0]),
          parseInt(splitedDate[1]),
          parseInt(splitedDate[2]),
          parseInt(splitedTime[0]),
          parseInt(splitedTime[1])+item.duration
        ) 

        let startH = parseInt(startDate.toTimeString().split(":")[0])
        let startM = parseInt(startDate.toTimeString().split(":")[1])

        let endH = parseInt(endDate.toTimeString().split(":")[0])
        let endM = parseInt(endDate.toTimeString().split(":")[1])

        let stampsFromReservation=[]
        var color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
        do{
          let obj = {
            startH: startH,
            startM: startM,
            services: item.services,
            color: color,
            id: item.id
          } 
          stampsFromReservation.push(obj)
      
          if(startM+10 === 60){
            startH++;
            startM=0;
          }else{
            startM=startM+10;
          }
        }while((startH + startM) !== (endH + endM))
        for(let j of stampsFromReservation){
          this.matrix.forEach(element => {
            if(element[0].startH === j.startH && element[0].startM === j.startM){
              this.matrix[element[0].id] = [element[0], {'filled': true, 'color':j.color, 'services': j.services, 'id': j.id}]
            }
          });
        }
      }
    })

  }

  selectEmployee(emp){
    this.timeStamps=[]
    this.selectedEmployee = emp;
    let today = new Date(this.selectedDate).getDay()
    let todayString = this.days[today.toString()]
    let workingHoursToday = emp.workingHours[todayString]
    var startH:any = parseInt(workingHoursToday.split("-")[0].split(":")[0]);
    var startM:any = parseInt(workingHoursToday.split("-")[0].split(":")[1]);
    var endH:any = parseInt(workingHoursToday.split("-")[1].split(":")[0]);
    var endM:any = parseInt(workingHoursToday.split("-")[1].split(":")[1]);
    var i=0;
    do{
      let obj = {
        id:i,
        startH: startH,
        startM: startM
      } 
      this.timeStamps.push(obj)

      if(startM+10 === 60){
        startH++;
        startM=0;
      }else{
        startM=startM+10;
      }
      i++
    }while((startH+startM) !== (endH+endM))
    this.getTimeline(this.selectedEmployee.userId)
  }


  onHold(id, services){
    this.selectedAppointment = "";
    this.selectedServices = services;
    this.id = id;
    this.timelineService.getAppointmentById(id.toString()).subscribe(item => {
      this.selectedAppointment = item;
      this.isOpen=true;
    })
  }

  deleteReservation(){
    this.isOpen=false;
    this.loading=true
    this.timelineService.removeAppointments(this.id.toString()).subscribe(res => {
      this.matrix=this.matrix.filter(x => x[1].id != this.id)
    },(err)=>{console.log(err)},()=>{this.loading=false; this.isOpen=false})
  }
}
