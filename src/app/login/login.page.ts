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
import jwt_decode from "jwt-decode";
import { ToastController } from '@ionic/angular';
import { isPlatform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { MediaLoginDTO } from './models/MediaLoginDTO';
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';

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
  loginDTO : MediaLoginDTO;
  userId : any;
  constructor(
             private route: ActivatedRoute,
              private authService: AuthService,
              private loginService: LoginService,
              private router: Router,
              private fb: FormBuilder,
              private toastController: ToastController) {
                this.signUpForm = this.fb.group({
                  name : ['', Validators.required],
                  surname : ['', Validators.required],
                  email: ['', [Validators.required, Validators.email]],
                  phone: ['', Validators.required],
                  password: ['', Validators.required],
                  repeatPassword: ['', Validators.required]
                });
                
                if(!isPlatform('capacitor')){
                  GoogleAuth.initialize();
                }
              }

   async ngOnInit() { 
     await FacebookLogin.initialize({ appId: '1096409884371369' });
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
      this.authService.getFirebaseToken().then(res => this.user.firebaseToken = res);

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
      this.authService.getFirebaseToken().then(res => this.user.firebaseToken = res);
      if(this.userId != null && this.userId != ""){
        this.user.userId = this.userId
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

   async googleSignUp(){
    // this.loginDTO = new MediaLoginDTO();
     const googleUser = await GoogleAuth.signIn();
     console.log(googleUser)
    // this.loginDTO.name = googleUser.givenName + " " + googleUser.familyName;
    // this.loginDTO.email = googleUser.email;
    // this.loginDTO.image = googleUser.imageUrl;
    // this.loginDTO.provider = "Google"
    // this.loginDTO.socialMediaId  = googleUser.id;

    // this.loginService.createSocialMediaLogin(this.loginDTO).subscribe(async response => {
    //   if(response != null) {
    //     if(response.accessToken != null && response.accessToken != undefined && response.accessToken != ""){
    //       await this.authService.saveAuthResponse(response);
    //       this.router.navigate(['/home']);
    //     } else {
    //       this.userId = response.userId;
    //       this.showFields = false;
    //     }
    //   } else {
    //     this.loading = false;
    //     this.presentToast('top', "Настана проблем, обидете се повторно");
    //   }
    // });

   }

   async facebookSignUp(){
    const FACEBOOK_PERMISSIONS = [ 'email', 'user_birthday', 'user_photos','user_gender', ];
    const result = await (<FacebookLoginResponse><unknown>(FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })));
    const result2 = await FacebookLogin.getProfile<{email: string; id: any; first_name: any; last_name: any; picture: any;}>({ fields: ['email', 'id', 'first_name', 'last_name', 'picture'] });

    this.loginDTO = new MediaLoginDTO();
    this.loginDTO.email = result2.email;
    this.loginDTO.image = result2.picture.data.url;
    this.loginDTO.name = result2.first_name + " " + result2.last_name;
    this.loginDTO.provider = "Facebook"
    this.loginDTO.socialMediaId  = result2.id;

    this.loginService.createSocialMediaLogin(this.loginDTO).subscribe(async response => {
      console.log(response)
      if(response != null) {
        if(response.accessToken != null && response.accessToken != undefined && response.accessToken != ""){
          await this.authService.saveAuthResponse(response);
          this.router.navigate(['/home']);
        } else {
          this.userId = response.userId;
          this.showFields = false;
        }
      } else {
        this.loading = false;
        this.presentToast('top', "Настана проблем, обидете се повторно");
      }
    });
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
