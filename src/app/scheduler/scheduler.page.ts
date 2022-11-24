import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { modalController } from '@ionic/core';
import { TimelineService } from '../timeline/services/timeline.service';
import { AuthService } from '../login/services/auth.service';
import { EmployeeServiceService } from "../employee/services/employee-service.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.page.html',
  styleUrls: ['./scheduler.page.scss'],
})
export class SchedulerPage implements OnInit {
  companyId = environment.companyId;
  appointmentsList = [];
  selectedDate:string=new Date(Date.now()).toISOString();
  selectedDateFormatted:string;
  selectedEmployee:any;
  employees:any=[];
  loading:Boolean=false;
  startHour:Number=9;
  startMinute:Number=0;
  endHour:Number=18;
  endMinute:Number=0;
  timeStamps:any=[];
  matrix: any;
  isOpen = false;
  id;
  constructor(private animationCtrl: AnimationController,
    private timelineService : TimelineService,
    private authService: AuthService,
    private empService: EmployeeServiceService) { }

  ngOnInit() {
    const date = this.selectedDate.split("T")[0]
    this.selectedDateFormatted = date;
    this.getEmployees()
  }

  getEmployees(){
    this.loading=true;
    this.empService.getEmployeesByCompanyId(this.companyId).subscribe(res => {
      this.employees=res;
    },()=>{this.loading=false}, ()=> {
      this.selectEmployee(this.employees[0])
      this.getTimeline(this.employees[0].userId);
      this.selectedEmployee=this.employees[0];
      this.loading=false;
    })
  }

  selectDate(event){
    const date = event.split("T")[0]
    this.selectedDateFormatted = date;
    this.selectedDate=event;
    this.getTimeline(this.employees[0].userId)
    modalController.dismiss()
  }


  getTimeline(userId){
    this.appointmentsList = [];
  
    this.timelineService.getTimelineEmployee(userId, this.selectedDateFormatted).subscribe(res => {
      if(res != null && res != undefined){
        this.appointmentsList = res;
      }
    },err => console.log(err),()=>{
      let id = 0;
      this.matrix=[]
      for(let i of this.timeStamps){
        this.matrix.push([i, {'filled': false}])
      }

      for(let item of this.appointmentsList){
        let splitedDate = item.startDate.split("-")
        let splitedTime = item.startTime.split(":")
        console.log(item)
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
        let startM = parseInt(startDate.toTimeString().split(":")[1])-1

        let endH = parseInt(endDate.toTimeString().split(":")[0])
        let endM = parseInt(endDate.toTimeString().split(":")[1])-1

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

        console.log(stampsFromReservation)
        for(let j of stampsFromReservation){
          this.matrix.forEach(element => {
            if(element[0].startH === j.startH && element[0].startM === j.startM){
              this.matrix[element[0].id] = [element[0], {'filled': true, 'color':j.color, 'services': j.services, 'id': j.id}]
            }
          });
        }
      }
      console.log(this.matrix)
    })

  }

  selectEmployee(emp){
    let today = new Date(Date.now()).getDay()
    console.log(today)
    var startH:any = this.startHour;
    var startM:any = this.startMinute;
    var endH:any = this.endHour;
    var endM:any = this.endMinute;
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
  }


  onHold(id){
    this.id = id;
    this.isOpen=true;
  }

  deleteReservation(){
    this.isOpen=false;
    this.loading=true
    this.timelineService.removeAppointments(this.id.toString()).subscribe(res => {
      this.matrix=this.matrix.filter(x => x[1].id != this.id)
    },(err)=>{console.log(err)},()=>{this.loading=false; this.isOpen=false})
  }
}
