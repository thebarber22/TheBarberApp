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
  selectedDate:Date;
  freeSlots:any[]=[];
  selectedSlot:any="/";
  selectedDateFormatted:string;
  companyId = environment.companyId;
  empName = JSON.parse(sessionStorage.getItem("employee")).displayName;


  async ngOnInit() {
    this.userId=this.route.snapshot.paramMap.get('userId')
    this.empserservice.getServicesByEmployee(this.userId).subscribe(res => {
      this.services=res;
    })
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
    console.log(event)
    const date = event.split("T")[0]
    this.selectedDateFormatted = date;
    this.empserservice.getFreeSlotsByEmployee(this.userId, date, this.selectedServices).subscribe(res => {
      if(res != null && res != undefined){
        this.freeSlots=res
      }
    },err => console.log(err))
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
    let reservation:AppointmentsService;
    console.log(this.selectedSlot)
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
      window.sessionStorage.removeItem("succ-reservs");
      res.employeeId = this.empName;
      window.sessionStorage.setItem("succ-reservs", JSON.stringify(res));
      this.router.navigate(["/succ-appointment"]);
    })
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
