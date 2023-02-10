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
  companyLogo : any;
  companyName : any;
  companyPhone : any;
  totalEmployees = 0;
  totalServices = 0;
  constructor(private homeService: HomeService,
              private sanitizer: DomSanitizer,
              private authService: AuthService) {} 

  async ngOnInit() { 
    this.getCompanyData();
    this.getEmployesData();
  }

 async getCompanyData(){
    await this.authService.getCompany().then(res => {
      this.company = JSON.parse(res)
      this.companyName = this.company.name;
      this.companyPhone = this.company.mobilePhone
      this.locationSrc = this.company.iframeMapUrl;
      this.companyLogo = this.company.companyLogo;
    })    
  }

  getEmployesData(){
    this.homeService.getCompanyDetails().subscribe(items => {
      if(items.services != null) {
        this.totalServices = items.services;
      }

      if(items.employes != null) {
        this.totalEmployees = items.employes;
      }
    })
  }

}
 
