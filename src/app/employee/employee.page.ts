import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeServiceService } from './services/employee-service.service';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {

  constructor(private empserservice: EmployeeServiceService,private route:ActivatedRoute) { }

  userId:string;

  async ngOnInit() {
    this.empserservice.sendMenuNotActive(false);

    this.userId=this.route.snapshot.paramMap.get('userId')

    this.empserservice.getServicesByEmployee(this.userId).subscribe(res => {
      console.log(res)
    })


  }

}
