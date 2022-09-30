import { Component } from '@angular/core';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SignUpService } from './services/signup.service';
import { HomeService } from '../home/services/home.service';
import { FormBuilder, FormGroup , Validators , FormControl } from "@angular/forms";
import { User } from './models/User';
import { environment } from 'src/environments/environment';
import { Device } from '@capacitor/device';
import { AuthService } from '../login/services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})
export class SignupPage {
  signUpForm: FormGroup;
  user: User;
  private companyId = environment.companyId;
  showAllFields = true;
  constructor(private homeService: HomeService,
    private signUpService: SignUpService,
    private router: Router,
    private fb: FormBuilder,
    private authService : AuthService) { 
      this.signUpForm = fb.group({
        'name' : ['', Validators.required],
        'surname' : ['', Validators.required ],
        'email': ['', Validators.required],
        'phone': ['', Validators.required],
      });
    } 

  async ngOnInit() { 
    if(this.authService.getUser() != null && this.authService.getUser() != undefined) {
      this.showAllFields = false;
    }
  }

  async signUp(){
    const info2 = await Device.getId();
    this.user = new User();
    this.user.name = this.signUpForm.controls["name"].value;
    this.user.surname = this.signUpForm.controls["surname"].value;
    this.user.email = this.signUpForm.controls["email"].value;
    this.user.mobile = this.signUpForm.controls["phone"].value;
    this.user.deviceId = info2.uuid;
    this.user.companyId = this.companyId;
    if(this.authService.getUser() != null && this.authService.getUser() != undefined){
      this.user.userId = this.authService.getUser().id;
    }


    this.signUpService.finishRegistration(this.user).subscribe(response => {
      if(response != null && response != "" && response != undefined) {
        if(response.userId){
          this.router.navigate(['/home']);
        } else {
          this.authService.saveAuthResponse(response);
          this.router.navigate(['/home']);
        }
     }
    })
  }
}
 
