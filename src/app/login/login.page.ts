import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AppConstants } from './constants/app.constants';
import { AuthService } from './services/auth.service';
import { Device } from '@capacitor/device';
import { HomeService } from '../home/services/home.service';
import { User } from './models/User';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './services/login.service';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  googleURL = AppConstants.GOOGLE_AUTH_URL;
  facebookURL = AppConstants.FACEBOOK_AUTH_URL;
  isLoggedIn = false;
  isLoginFailed = false;
  currentUser: any;
  errorMessage: any;
  selectedSection : any;
  showFields = null;
  user: User;
  signUpForm: FormGroup;
  loading:Boolean=false;
  private companyId = environment.companyId;
  submitted = false;
  prefix: any = "+389";
  counter = 0;
  constructor(
             private route: ActivatedRoute,
              private authService: AuthService,
              private loginService: LoginService,
              private router: Router,
              private fb: FormBuilder,
              private empserservice: EmployeeServiceService) {
                this.signUpForm = this.fb.group({
                  name : ['', Validators.required],
                  surname : ['', Validators.required],
                  email: ['', [Validators.required, Validators.email]],
                  phone: ['', Validators.required],
                });
               }

   ngOnInit() { 
    this.empserservice.sendMenuNotActive(false)
     if(this.route.snapshot.queryParamMap.get('token')){
      this.showFields = false;
      const token = this.route.snapshot.queryParamMap.get('token');
      const decoded = jwt_decode(token);
  		this.authService.saveToken(token);
        this.authService.getCurrentUser(decoded['sub']).subscribe(data => { 
          this.login(data);
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      )} else {
        this.showFields = true;
      }
    } 

  removeAuthFromSession(){
    this.authService.signOut();
  }

  login(user): void {
      this.authService.saveUser(user);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.currentUser = this.authService.getUser();
  }


  get f(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  async signUp(){
    if((this.checkRequired()) || (this.checkRequired() || this.signUpForm.controls["phone"].value != "")){
    this.loading=true;
    const info2 = await Device.getId();
    this.user = new User();
    this.user.name = this.signUpForm.controls["name"].value;
    this.user.surname = this.signUpForm.controls["surname"].value;
    this.user.email = this.signUpForm.controls["email"].value;
    this.user.mobile = this.prefix + "" +this.signUpForm.controls["phone"].value;
    this.user.deviceId = info2.uuid;
    this.user.companyId = this.companyId;
    let sessionUserId = await this.authService.getUser();
    console.log(sessionUserId)
    if(sessionUserId != null && sessionUserId != undefined){
      this.user.userId = sessionUserId.userId;
    }
    console.log(this.user)
    this.loginService.finishRegistration(this.user).subscribe(response => {
      if(response != null && response != "" && response != undefined) {
        console.log(response)
        if(response.userId){
          this.router.navigate(['/home']);
        } else {
          this.authService.saveAuthResponse(response);
          this.router.navigate(['/home']);
        }
    }
    },()=>{this.loading=false},()=>{this.loading=false})
  }
}

  checkRequired(){
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return false;
    } else {
      return true;
    }
  }


  googleSignUp(){
    window.location.href = this.googleURL;
  }

  facebookSignUp(){
    window.location.href = this.facebookURL;
  }

  countClicks(){
    this.counter++;
    
    
    setTimeout(() => {  
      this.counter = 0;
    }, 5000);

    if(this.counter == 10){
      this.router.navigate(["/hidden-login"]);
    }
  }

}
