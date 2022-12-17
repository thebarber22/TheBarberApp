import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isTabSwitch } from '@ionic/angular/directives/navigation/stack-utils';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { HomeService } from '../home/services/home.service';
import { AuthService } from '../login/services/auth.service';
import { AppointmentsService } from './model/AppointmentsService';
import { Service } from './model/Service';
import { EmployeeServiceService } from './services/employee-service.service';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

  constructor(private empserservice: EmployeeServiceService,
            private route:ActivatedRoute,
            private homeService:HomeService,
            private cdRef: ChangeDetectorRef,
            private router: Router,
            private auth: AuthService) { }
  @ViewChild('content2') private content2: any;
  services:Service[];
  userId:string;
  selectedServices:Service[]=[];
  selectedPage:number=0;
  selectedDate:string=new Date(Date.now()).toISOString();
  freeSlots:any[]=[];
  selectedSlot:any="/";
  selectedDateFormatted:string;
  companyId = environment.companyId;
  empName = JSON.parse(sessionStorage.getItem("employee")).displayName;
  startDateTimeReserve:any;
  servicesNameReserve:any;
  employeeNameReserve:any;
  loading:Boolean=false;
  loadingTimes:Boolean=false;
  today = moment().format();
  disabled = true;
  async ngOnInit() {
    this.selectedDate = this.today;
    this.userId=this.route.snapshot.paramMap.get('userId')
    this.loading=true;
    console.log(this.selectedDate)
    this.empserservice.getServicesByEmployee(this.userId).subscribe(res => {
      this.services=res;
    },()=>{this.loading=false}, ()=> {this.loading=false})
  }

  selection(serviceId){
    console.log(serviceId)
    let selected = this.services.find(el=>el.serviceId == serviceId)
    let index = this.selectedServices.indexOf(selected)
    if (index > -1) { 
      this.selectedServices.splice(index, 1); 
      selected.selected=false;
    }else{
      selected.selected=true;
      this.selectedServices.push(selected)
    }
    this.cdRef.detectChanges();
    
    if(this.selectedServices.length > 0){
      this.disableButton(false);
    } else {
      this.disableButton(true);
    }
    console.log(this.selectedServices)
  }

  nextStep(event){
    if(event==true){
      if(this.selectedPage == 0){
        this.selectDate(this.today)
      }
      this.selectedPage++;
    }
  }

  selectDate(event){
    this.freeSlots=[]
    this.disableButton(true)
    this.loadingTimes=true;
    const date = event.split("T")[0]
    this.selectedDateFormatted = date;
    let pipe = new DatePipe('en-US');
    let weekDay = pipe.transform(date, 'EEEE');
    this.empserservice.getFreeSlotsByEmployee(this.userId, date, this.selectedServices, weekDay).subscribe(res => {
      const dateNow = new Date()
      if(res != null && res != undefined){
        for(let element of res) {
          if(date === dateNow.toISOString().split("T")[0]){
            if(element.startHours < dateNow.getHours()){
              continue;
            }
            if(element.startHours === dateNow.getHours() && element.startMinutes <= dateNow.getMinutes()){
              continue;
            }
          }
          if(element.startMinutes == 0){
            element.startMinutes="00"
          }
          this.freeSlots.push(element)
        }
      }
    },()=>{this.loadingTimes=false}, ()=> {this.loadingTimes=false})
  }

  selectionTime(time){
    const content2 = document.getElementById("content2")
    content2.scroll({ top: content2.scrollHeight, behavior: 'smooth' });
    this.selectedSlot=time;
    this.freeSlots.forEach(i => {
      document.getElementById(i.id).style.backgroundColor='white'
      document.getElementById(i.id).style.color='black'
      document.getElementById(i.id).style.borderColor='black'

    })
    document.getElementById(time.id).style.backgroundColor='#EAC646'
    document.getElementById(time.id).style.color='white'
    document.getElementById(time.id).style.borderColor='#EAC646'
    this.cdRef.detectChanges();
    this.disableButton(false);
  }

  async reserve(){
    this.loading=true;
    if(this.selectedSlot.startMinutes == "00"){
      this.selectedSlot.startMinutes = 0;
    }
    let reservation:AppointmentsService;
    let startDateTimeAppointment = this.selectedDateFormatted+'T'+this.selectedSlot.startHours.toString()+":"+this.selectedSlot.startMinutes.toString()+":00"
    let endDateTimeAppointment = this.selectedDateFormatted+'T'+this.selectedSlot.endHours.toString()+":"+this.selectedSlot.endMinutes.toString()+":00"
    let clientId;
    await this.auth.getUser().then(res => {
      let client = JSON.parse(res)
      clientId = client.id
    }).finally(()=>{
      console.log(clientId)
      reservation = {
        startDateTime:startDateTimeAppointment,
        endDateTime:endDateTimeAppointment,
        companyId:this.companyId,
        clientId:clientId,
        employeeId:this.userId,
        serviceList:this.selectedServices
      }
    })

    this.empserservice.makeReservation(reservation).subscribe(res => {
      this.startDateTimeReserve = reservation.startDateTime.replace('T', ' ');
      this.servicesNameReserve = res.serviceList[0].name;
      this.employeeNameReserve = this.empName
      this.selectedPage=2;
    },()=>{this.loading=false}, ()=> {this.loading=false})
  }

  disableButton(value){
    this.disabled = value;
  }

  back(){
    this.selectedPage=0;
    this.cdRef.detectChanges();
  }

  backToHome(){
    this.router.navigate(["/home"]);
  }
}

