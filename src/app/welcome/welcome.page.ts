import { Component, OnInit} from '@angular/core';
import { AuthService } from '../login/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  isModalOpen = false;
  token:any;
  user:any;

 constructor(private router: Router,
             private authService: AuthService){}

  ngOnInit() {
    this.checkUser();
  }

  async goToLogin(){
    this.router.navigate(["/login"]);
  }

  async checkUser(){
    await this.authService.getToken().then(res => {
      this.token = res;
    })
    await this.authService.getUser().then(res => {
      this.user = res;
    })
    setTimeout(() => {  
      if(this.token != null && this.user != null){
        this.router.navigate(['home'])
     }
    }, 100);
  }
}
