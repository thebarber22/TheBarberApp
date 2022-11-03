import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HomeService } from '../home/services/home.service';
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
            private router: Router,) { }

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

  async ngOnInit() {
    this.empserservice.sendMenuNotActive(false)
    this.userId=this.route.snapshot.paramMap.get('userId')
    this.loading=true;
    console.log(this.selectedDate)
    this.empserservice.getServicesByEmployee(this.userId).subscribe(res => {
      this.services=res;
    },()=>{this.loading=false}, ()=> {this.loading=false})
  }

  selection(serviceId){
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
  }

  nextStep(event){
    if(event==true){
      this.selectedPage++;
    }
  }

  selectDate(event){
    this.loadingTimes=true;
    const date = event.split("T")[0]
    this.selectedDateFormatted = date;
    this.empserservice.getFreeSlotsByEmployee(this.userId, date, this.selectedServices).subscribe(res => {
      if(res != null && res != undefined){
        res.forEach(element => {
          if(element.startMinutes == 0){
            element.startMinutes="00"
          }
        });
        this.freeSlots=res
      }
    },()=>{this.loadingTimes=false}, ()=> {this.loadingTimes=false})
  }

  selectionTime(time){
    this.selectedSlot=time;
    console.log(this.selectedSlot)
    this.freeSlots.forEach(i => {
      document.getElementById(i.id).style.backgroundColor='white'
      document.getElementById(i.id).style.color='black'
      document.getElementById(i.id).style.borderColor='black'

    })
    document.getElementById(time.id).style.backgroundColor='#EAC646'
    document.getElementById(time.id).style.color='white'
    document.getElementById(time.id).style.borderColor='#EAC646'
    this.cdRef.detectChanges();

  }

  async reserve(){
    this.loading=true;
    if(this.selectedSlot.startMinutes == "00"){
      this.selectedSlot.startMinutes = 0;
    }
    let reservation:AppointmentsService;
    let startDateTimeAppointment = this.selectedDateFormatted+'T'+this.selectedSlot.startHours.toString()+":"+this.selectedSlot.startMinutes.toString()+":00"
    let endDateTimeAppointment = this.selectedDateFormatted+'T'+this.selectedSlot.endHours.toString()+":"+this.selectedSlot.endMinutes.toString()+":00"
    reservation = {
      startDateTime:startDateTimeAppointment,
      endDateTime:endDateTimeAppointment,
      companyId:this.companyId,
      clientId:JSON.parse(sessionStorage.getItem("auth-user")).id,
      employeeId:this.userId,
      serviceList:this.selectedServices
    }

    this.empserservice.makeReservation(reservation).subscribe(res => {
      this.startDateTimeReserve = res.startDateTime;
      this.servicesNameReserve = res.serviceList[0].name;
      this.employeeNameReserve = this.empName
      this.selectedPage=2;
    },()=>{this.loading=false}, ()=> {this.loading=false})
  }

  back(){
    this.selectedPage=0;
    console.log(this.selectedPage)
    this.cdRef.detectChanges();
  }

  backToHome(){
    this.router.navigate(["/home"]);
  }
}
