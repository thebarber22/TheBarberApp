import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { AuthService } from '../login/services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  isModalOpen = false;
  token;
  constructor(private empserservice: EmployeeServiceService,
              private router: Router,
              private authService: AuthService) {}

  async ngOnInit() {
    await this.authService.getToken()
      .then(res => {
        console.log(res)
        this.token = res;
      })
    if (this.token) {
      this.router.navigateByUrl('home');
    }
    this.empserservice.sendMenuNotActive(false)
  }

  async goToLogin(){
    this.router.navigate(["/login"]);
  }
 
}
