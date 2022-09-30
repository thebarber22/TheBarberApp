import { Component, OnInit } from '@angular/core';
import { EmployeeServiceService } from './employee/services/employee-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  constructor(private empService: EmployeeServiceService) {}
  showMenu:boolean=true;

  ngOnInit() {
    this.empService.getMenuNotActive().subscribe(val => this.showMenu=val)
  }

}
