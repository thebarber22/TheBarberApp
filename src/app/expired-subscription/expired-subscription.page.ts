import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/services/auth.service';

@Component({
  selector: 'app-expired-subscription',
  templateUrl: './expired-subscription.page.html',
  styleUrls: ['./expired-subscription.page.scss'],
})
export class ExpiredSubscriptionPage implements OnInit {
  company : any;
  user : any = true;
  moderator : any = true;
  startDateTime: any = "";
  endDateTime: any = "";
  constructor(private router: Router,
              private authService : AuthService,
              public datepipe: DatePipe) { }

  ngOnInit() {
    this.getCompany()
  }

  async getCompany(){
    await this.authService.getCompany().then(res => {
      this.company = JSON.parse(res)
      this.checkUserRole();
       if(this.company.packagePlan != null) {
         this.endDateTime = this.datepipe.transform(this.company.packagePlan.endDateTime, "dd-MM-YYYY")
         this.startDateTime = this.datepipe.transform(this.company.packagePlan.startDateTime, "dd-MM-YYYY")
        }
    })
  }


  async checkUserRole(){
    await this.authService.getUser().then(res => {
      let user = JSON.parse(res)
      if(user != null && user.roles != null) {
        if(user.roles.includes("ROLE_MODERATOR") || user.roles.includes("ROLE_EMPLOYEE")){
          this.user = false;
          this.moderator = true;
        } else {
          this.user = true;
          this.moderator = false;
        }
      }
    })
  }
}
