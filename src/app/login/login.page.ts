import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AppConstants } from './constants/app.constants';
import { AuthService } from './services/auth.service';
import { Device } from '@capacitor/device';
import { HomeService } from '../home/services/home.service';
import { User } from './models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './services/login.service';

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
  showFields = true;
  user: User;
  signUpForm: FormGroup;
  private companyId = environment.companyId;

  constructor(
             private route: ActivatedRoute,
              private authService: AuthService,
              private loginService: LoginService,
              private router: Router,
              private fb: FormBuilder) {
                this.signUpForm = fb.group({
                  'name' : ['', Validators.required],
                  'surname' : ['', Validators.required ],
                  'email': ['', Validators.required],
                  'phone': ['', Validators.required],
                });
               }

   ngOnInit() { 
    const token: string = this.route.snapshot.queryParamMap.get('token');  
  	if (this.authService.getToken()) {
      this.isLoggedIn = true;
      this.currentUser = this.authService.getUser();
    }
  	else if(token){
  		this.authService.saveToken(token);
  		this.authService.getCurrentUser().subscribe(data => { 
  		        this.login(data);
  		      },
  		      err => {
  		        this.errorMessage = err.error.message;
  		        this.isLoginFailed = true;
  		      }
  		  );
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
      this.showFields = false;
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


    this.loginService.finishRegistration(this.user).subscribe(response => {
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
  googleSignUp(){
    window.location.href = this.googleURL;
  }

  facebookSignUp(){
    window.location.href = this.facebookURL;
  }
}