import { Component } from '@angular/core';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HomeService } from '../home/services/home.service';
import { FormBuilder, FormGroup , Validators , FormControl } from "@angular/forms";
import { environment } from 'src/environments/environment';
import { Device } from '@capacitor/device';
import { AuthService } from '../login/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-location',
  templateUrl: 'location.page.html',
  styleUrls: ['location.page.scss'],
})
export class LocationPage {
  company : any;
  locationSrc : any;
  companyName : any;
  companyPhone : any;
  constructor(private homeService: HomeService,
              private sanitizer: DomSanitizer,
              private authService: AuthService) {} 

  async ngOnInit() { 
    console.log("hereee")
    this.getCompanyData();
  }

 async getCompanyData(){
    await this.authService.getCompany().then(res => {
      this.company = JSON.parse(res)
      this.companyName = this.company.name;
      this.companyPhone = this.company.mobilePhone
      this.locationSrc = this.company.iframeMapUrl;
    })    
  }

}
 
