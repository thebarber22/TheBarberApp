import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../home/services/home.service';
import { EmployeeServiceService } from './services/employee-service.service';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

  constructor(private empserservice: EmployeeServiceService,
            private route:ActivatedRoute,
            private homeService:HomeService) { }

  userId:string;

  async ngOnInit() {
    this.userId=this.route.snapshot.paramMap.get('userId')
    this.empserservice.getServicesByEmployee(this.userId).subscribe(res => {
      console.log(res)
    })
  }

}
