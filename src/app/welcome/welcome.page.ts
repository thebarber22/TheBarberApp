import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeServiceService } from '../employee/services/employee-service.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  isModalOpen = false;
  constructor(private empserservice: EmployeeServiceService,
              private router: Router,) { }

  ngOnInit() {
    this.empserservice.sendMenuNotActive(false)
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
