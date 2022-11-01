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
  constructor(private homeService: HomeService,
              private sanitizer: DomSanitizer) {} 

  async ngOnInit() { 
    this.getCompanyData();
  }

  getCompanyData(){
    this.company = this.homeService.getCompany();
    this.companyName = this.company.name;
    this.locationSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.company.iframeMapUrl);
  }

}
 
