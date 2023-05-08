import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { isPlatform, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { User } from '../login/models/User';
import { AuthService } from '../login/services/auth.service';
import { HiddenLoginService } from './services/hidden-login.service';
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { MediaLoginDTO } from '../login/models/MediaLoginDTO';
import { TranslateService } from '@ngx-translate/core';
import {
  SignInWithApple,
  ASAuthorizationAppleIDRequest,
  AppleSignInResponse,
  AppleSignInErrorResponse
} from "@ionic-native/sign-in-with-apple/ngx";

@Component({
  selector: 'app-hidden-login',
  templateUrl: 'hidden-login.page.html',
  styleUrls: ['hidden-login.page.scss'],
})
export class HiddenLoginPage {
  loading:Boolean=false;
  signUpForm: FormGroup;
  submitted = false;
  user: User;
  login = true;
  private companyId = environment.companyId;
  loginDTO : MediaLoginDTO;
  selectedLang: any;
  constructor(private fb: FormBuilder,
              private hiddenLoginService: HiddenLoginService,
              private authService : AuthService,
              private router: Router,
              private toastController: ToastController,
              private translate: TranslateService, private signInWithApple: SignInWithApple) {
       this.signUpForm = this.fb.group({
         email: ['', [Validators.required, Validators.email]],
         password: ['', Validators.required],
       });
       
      if(!isPlatform('capacitor')){
        GoogleAuth.initialize({
          clientId: '266915288245-ca0r830cdlc2q4b768e67k73bsjnrhl9.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
      }
    }

   async ngOnInit() { 
    this.checkDefaultLanguage();
      //await FacebookLogin.initialize({ appId: '1096409884371369' });
   }

   checkDefaultLanguage(){
    this.authService.getLanguage().then(lang => {
      if(lang != null && lang != undefined && lang != ""){
        this.selectedLang = lang;
        this.translate.use(lang);
      } else {
        this.selectedLang = this.translate.getDefaultLang()
        this.translate.use(this.selectedLang);
      }
    });    
  }

  async hiddenLogin(){
    if(this.checkRequired()){
      this.loading=true;
      const info2 = await Device.getId();
      this.user = new User();
      this.user.email = this.signUpForm.controls["email"].value;
      this.user.password = this.signUpForm.controls["password"].value;
      this.user.deviceId = info2.uuid;
      this.user.companyId = this.companyId;
      this.authService.getFirebaseToken().then(res => this.user.firebaseToken = res);
      this.hiddenLoginService.hiddenLogin(this.user).subscribe(response => {
        if(response != null){
          this.authService.saveAuthResponse(response);
          this.loading=false;
          this.router.navigate(['/home']);
        } else {
          this.loading = false;
          this.translate.get('wrongPasswordOrEmail').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
        }
      }, () => this.router.navigate(['error']));
    }
  }

  async facebookLogin(){
    const FACEBOOK_PERMISSIONS = [ 'email', 'user_birthday', 'user_photos','user_gender', ];
    const result = await (<FacebookLoginResponse><unknown>(FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })));
    const result2 = await FacebookLogin.getProfile<{email: string; id: any; first_name: any; last_name: any; picture: any;}>({ fields: ['email', 'id', 'first_name', 'last_name', 'picture'] });

    this.loginDTO = new MediaLoginDTO();
    this.loginDTO.email = result2.email;
    this.loginDTO.socialMediaId  = result2.id;

    this.loginFromSocialMedia(this.loginDTO)

  }

  async googleLogin(){
    this.loading = true;
    this.loginDTO = new MediaLoginDTO();
    const googleUser = await GoogleAuth.signIn();
    this.loginDTO.email = googleUser.email;
    this.loginDTO.provider = "Google"
    this.loginDTO.socialMediaId  = googleUser.id;
    this.loginFromSocialMedia(this.loginDTO);
  }

  loginFromSocialMedia(loginDTO){
    this.loading = true;
    this.authService.getFirebaseToken().then(res => this.loginDTO.firebaseToken = res);
    this.hiddenLoginService.socialMediaLogin(loginDTO).subscribe(async response => {
      if(response != null) {
        if(response.accessToken != null && response.accessToken != undefined && response.accessToken != ""){
          await this.authService.saveAuthResponse(response);
          this.router.navigate(['/home']);
        } else {
          this.loading = false;
          this.router.navigate(['error'])
        }
      } else {
        this.loading = false;
        this.translate.get('accountNotFound').subscribe((translatedString) => {
          this.presentToast('top', translatedString);
        })
        this.router.navigate(['/login']);
      }
      this.loading = false;
    }); 
  }

  resetPass(){
    this.loading = true;
    let email = this.signUpForm.controls["email"].value;
    if(email != null && email != ""){
      this.hiddenLoginService.resetPass(email).subscribe(response => {
        if(response != null && response == true){
          this.login = true;
          this.translate.get('newPasswordSent').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
          this.submitted = false;
          this.loading = false;
        } else {
          this.loading = false;
          this.router.navigate(['error'])
        }
      });
    } else {
      this.loading = false;
      this.submitted = true;
    }
  }

  checkRequired(){    
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return false;
    } 

    if(this.signUpForm.controls["password"].value.length < 8){
      this.translate.get('passwordMinCharacters').subscribe((translatedString) => {
        this.presentToast('top', translatedString);
      })
      return false;
    }

    return true;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  goToRegister(){
    this.router.navigate(['/login']);
  }

  appleLogin() {

    this.signInWithApple
      .signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
        ]
      })
      .then((res: AppleSignInResponse) => {

        if(res){
          this.loginDTO = new MediaLoginDTO();
          this.loginDTO.email = res.email;
          this.loginDTO.provider = "Apple"
          this.loginDTO.socialMediaId  = res.user;
          this.loginFromSocialMedia(this.loginDTO);
        }

      })
      .catch((error: AppleSignInErrorResponse) => {
        console.error(error);
      });

  }
}
