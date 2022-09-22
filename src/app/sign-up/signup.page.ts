import { Component } from '@angular/core';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SignUpService } from './services/signup.service';
import { HomeService } from '../home/services/home.service';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})
export class SignupPage {
  constructor(private homeService: HomeService,
    private signUpService: SignUpService,
    private router: Router) { }

  async ngOnInit() { 
    this.homeService.sendMenuNotActive(false);
  }
}
 
