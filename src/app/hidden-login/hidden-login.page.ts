import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
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
  private companyId = environment.companyId;

  constructor(private fb: FormBuilder,
              private empserservice: EmployeeServiceService,
              private hiddenLoginService: HiddenLoginService,
              private authService : AuthService,
              private router: Router) {
       this.signUpForm = this.fb.group({
         email: ['', Validators.required, Validators.email],
       });
      }

   ngOnInit() { 
    this.empserservice.sendMenuNotActive(false)
   }

   async hiddenLogin(){
      this.loading=true;
      const info2 = await Device.getId();
      this.user = new User();
      this.user.email = this.signUpForm.controls["email"].value;
      this.user.deviceId = info2.uuid;
      this.user.companyId = this.companyId;

      this.hiddenLoginService.hiddenLogin(this.user).subscribe(response => {
        console.log(response)
        if(response != null){
          this.authService.saveAuthResponse(response);
          this.router.navigate(['/home']);
        }
      },()=>{this.loading=false},()=>{this.loading=false})
   }
}
