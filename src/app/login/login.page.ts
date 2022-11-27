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
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  googleURL = AppConstants.GOOGLE_AUTH_URL;
  facebookURL = AppConstants.FACEBOOK_AUTH_URL;
  isLoginFailed = false;
  currentUser: any;
  errorMessage: any;
  selectedSection : any;
  showFields = true;
  user: User;
  signUpForm: FormGroup;
  loading:Boolean=false;
  companyId = environment.companyId;
  submitted = false;
  prefix: any = "+389";
  counter = 0;
  passwordNoMatching = true;
  constructor(
             private route: ActivatedRoute,
              private authService: AuthService,
              private loginService: LoginService,
              private router: Router,
              private fb: FormBuilder,
              private empserservice: EmployeeServiceService,
              private toastController: ToastController) {
                this.signUpForm = this.fb.group({
                  name : ['', Validators.required],
                  surname : ['', Validators.required],
                  email: ['', [Validators.required, Validators.email]],
                  phone: ['', Validators.required],
                  password: ['', Validators.required],
                  repeatPassword: ['', Validators.required]
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
          this.authService.saveUser(data);
          setTimeout(() => {  
            if(data.mobile != null){
              this.router.navigate(['/home']);
            } 
          }, 100);
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      )} else {
        this.showFields = true;
      }
    } 
    
  async signUpNewUser(){
    if(this.checkRequired()){
      this.loading = true;
      this.user = new User();
      const info2 = await Device.getId();
      this.user.name = this.signUpForm.controls["name"].value;
      this.user.surname = this.signUpForm.controls["surname"].value;
      this.user.email = this.signUpForm.controls["email"].value;
      this.user.mobile = this.prefix + "" +this.signUpForm.controls["phone"].value;
      this.user.deviceId = info2.uuid;
      this.user.companyId = this.companyId;
      this.user.password = this.signUpForm.controls["password"].value;
      this.loginService.signUpNewUser(this.user).subscribe(response => {
        console.log(response)
        if(response != null && response != "" && response != undefined) {
            this.authService.saveAuthResponse(response);
            this.router.navigate(['/home']);
          } else {
            this.loading = false;
            this.presentToast('top', "Настана проблем, обидете се повторно");
          }
      })
    }
  }
  

  async finishSocialMediaRegistration(){
    if(this.signUpForm.controls["phone"].value != "") {
      this.loading = true;
      const info2 = await Device.getId();
      this.user = new User();
      this.user.mobile = this.prefix + "" +this.signUpForm.controls["phone"].value;
      this.user.deviceId = info2.uuid;
      this.user.companyId = this.companyId;
      let sessionUserId = this.authService.getUser();
      if(sessionUserId != null && sessionUserId != undefined){
        this.user.userId = sessionUserId.userId;
      }

      this.loginService.finishRegistration(this.user).subscribe(response => {
        if(response != null && response != "" && response != undefined) {
          this.authService.saveAuthResponse(response);
          this.router.navigate(['/home']);
        } else {
          this.loading = false;
          this.presentToast('top', "Настана проблем, обидете се повторно");
        }
      });
    }
  }
 
  goToLogin(){
    this.router.navigate(["/hidden-login"]);
  }

  checkRequired(){    
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return false;
    } 

    if(this.signUpForm.controls["password"].value != this.signUpForm.controls["repeatPassword"].value){
      this.signUpForm.controls["password"].setValue("");
      this.signUpForm.controls["repeatPassword"].setValue("");
      this.presentToast('top', "Лозинките не се софпаѓаат");
      return false;
    }


    if(this.signUpForm.controls["password"].value.length < 8){
      this.presentToast('top', "Лозинкатa мора да содржи минимум 8 карактери");
      return false;
    }

    return true;
  }

  googleSignUp(){
    window.location.href = this.googleURL;
  }

  facebookSignUp(){
    window.location.href = this.facebookURL;
  }
  
  async presentToast(position: 'top' | 'middle' | 'bottom', message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  removeAuthFromSession(){
    this.authService.signOut();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

}
