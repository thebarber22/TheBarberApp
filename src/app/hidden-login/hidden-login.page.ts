import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { User } from '../login/models/User';
import { AuthService } from '../login/services/auth.service';
import { HiddenLoginService } from './services/hidden-login.service';
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

  constructor(private fb: FormBuilder,
              private empserservice: EmployeeServiceService,
              private hiddenLoginService: HiddenLoginService,
              private authService : AuthService,
              private router: Router,
              private toastController: ToastController) {
       this.signUpForm = this.fb.group({
         email: ['', [Validators.required, Validators.email]],
         password: ['', Validators.required],
       });
      }

   ngOnInit() { 
    this.empserservice.sendMenuNotActive(false)
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

      this.hiddenLoginService.hiddenLogin(this.user).subscribe(response => {
        console.log(response)
        if(response != null){
          this.authService.saveAuthResponse(response);
          this.router.navigate(['/home']);
        } else {
          this.loading = false;
          this.presentToast('top', "Погрешна лозинка или емаил адреса");
        }
    });
  }
}


  resetPass(){
    this.loading = true;
    let email = this.signUpForm.controls["email"].value;
    if(email != null && email != ""){
      this.hiddenLoginService.resetPass(email).subscribe(response => {
        console.log(response)
        if(response != null && response == true){
          this.login = true;
          this.presentToast('top', "Новата лозинка е испратена на вашиот емаил");
          this.submitted = false;
          this.loading = false;
        } else {
          this.loading = false;
          this.presentToast('top', "Настана грешка, обидете се повторно");
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
      this.presentToast('top', "Лозинкaтa мора да содржи минимум 8 карактери");
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
}
