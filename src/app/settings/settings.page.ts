import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { User } from '../login/models/User';
import { AuthService } from '../login/services/auth.service';
import { MailDTO } from '../shared/models/MailDTO';
import { PasswordDTO } from '../shared/models/passwordDTO';
import { SettingsService } from './services/settings.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  loading:Boolean=false;
  monError = false;
  tueError = false;
  wedError = false;
  thuError = false;
  friError = false;
  satError = false;
  sunError = false;
  settingsModal = false;
  documentsModal = false;
  myProfileModal = false;
  employeeProfileModal = false;
  userProfileModal = false;
  passwordModal = false;
  removeProfileModal = false;
  contactModal = false;
  userForm: FormGroup;
  passForm: FormGroup;
  workingHours: FormGroup;
  empForm: FormGroup;
  contactForm: FormGroup;
  submitted = false;
  user;
  companyId = environment.companyId;
  userDTO : User;
  passwordDTO : PasswordDTO;
  mailDTO : MailDTO;
  employees = [];
  isManager = false;
  employeeId = "";
  showForReservation = false;
  constructor(private authService : AuthService,
              private router: Router,
              private fb: FormBuilder,
              private settingsService : SettingsService,
              private toastController : ToastController,
              private employeeService : EmployeeServiceService
              ) {
                this.userForm = this.fb.group({
                  name : ['', Validators.required],
                  surname : ['', Validators.required],
                  email: ['', [Validators.required, Validators.email]],
                  phone: ['', Validators.required],
                });
                this.passForm = this.fb.group({
                  oldPassword : ['', Validators.required],
                  newPassword : ['', Validators.required],
                  newPasswordRepeat: ['', Validators.required],
                });
                this.workingHours = this.fb.group({
                  mon : [''],
                  tue : [''],
                  wed : [''],
                  thu : [''],
                  fri : [''],
                  sat : [''],
                  sun : [''],
                });
                this.empForm = this.fb.group({
                  userId : [''],
                });
                this.contactForm = this.fb.group({
                  title : ['', Validators.required],
                  message : ['', Validators.required],
                })
              }

  async ngOnInit() {
    await this.authService.getUser().then(item => this.user = item).complete(item => this.getUserById(this.user.id));
    console.log(this.user)
  }

  onChangeEmp(){
    this.getUserById(this.empForm.controls["userId"].value);
  }

  updateUser(){
    this.loading = true;
    if(this.checkRequiredUser()){
      this.userDTO = new User();
      this.userDTO.userId = this.user.id;
      this.userDTO.companyId = this.companyId;
      this.userDTO.name = this.userForm.controls["name"].value;
      this.userDTO.surname =  this.userForm.controls["surname"].value;
      this.userDTO.email = this.userForm.controls["email"].value;
      this.userDTO.mobile = this.userForm.controls["phone"].value;

      this.settingsService.updateUser(this.userDTO).subscribe(data => { 
        if(data != null) {
          this.fillUserForm(data)
          this.presentToast("top", "Податоците се успешно променети")
          this.loading = false;
        } else {
          this.presentToast("top", "Настана проблем, обидете се повторно")
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  getEmployesByCompany(){
    this.employeeService.getEmployeesByCompanyId(this.companyId).subscribe(data => { 
      if(data != null) {
        this.employees = data;
      } 
    });
  }



  updateEmployee(){
    this.loading = true;
    if(this.checkRequiredUser() && this.checkRequiredEmployee()){
      this.userDTO = new User();
      this.userDTO.userId = this.employeeId;
      this.userDTO.companyId = this.companyId;
      this.userDTO.name = this.userForm.controls["name"].value;
      this.userDTO.surname =  this.userForm.controls["surname"].value;
      this.userDTO.email = this.userForm.controls["email"].value;
      this.userDTO.mobile = this.userForm.controls["phone"].value;
      this.userDTO.showForReservation = this.showForReservation;
      let workingHours = {monday: this.workingHours.controls["mon"].value, tuesday: this.workingHours.controls["tue"].value, wednesday: this.workingHours.controls["wed"].value, thursday: this.workingHours.controls["thu"].value, friday: this.workingHours.controls["fri"].value, saturday: this.workingHours.controls["sat"].value, sunday: this.workingHours.controls["sun"].value};
      this.userDTO.workingHours = workingHours;

      this.settingsService.updateUser(this.userDTO).subscribe(data => { 
        if(data != null) {
          this.fillUserForm(data)
          this.loading = false;
          this.presentToast("top", "Податоците се успешно променети")
        } else {
          this.loading = false;
          this.presentToast("top", "Настана проблем, обидете се повторно")
        }
      });
    } else {
      this.presentToast("top", "Валиден формат 00:00-23:59")
      this.loading = false;
    }
  }

  changePass(){
    console.log("here i am")
    this.loading = true;
    if(this.checkRequiredPassword()){
      this.passwordDTO = new PasswordDTO;
      this.passwordDTO.userId = this.user.id;
      this.passwordDTO.companyId = this.companyId;
      this.passwordDTO.newPassword = this.passForm.controls["newPassword"].value;

      this.settingsService.changePassword(this.passwordDTO).subscribe(data => { 
        this.passForm.reset();
        if(data){
          this.loading = false;
          this.presentToast("top", "Лозинката е успешно променета")
        } else {
          this.loading = false;
          this.presentToast("top", "Настана проблем, обидете се повторно")
        }
      })
    } else {
      this.loading = false;
    }
  }

  sendMessage(){
    this.loading = true;
    if(this.checkRequiredMessage()){
        this.mailDTO = new MailDTO;
        this.mailDTO.title = this.contactForm.controls["title"].value;
        this.mailDTO.message = this.contactForm.controls["message"].value;
        this.settingsService.sendMessage(this.mailDTO).subscribe(data => { 
          if(data == true){
            this.loading = false;
            this.presentToast("top", "Пораката е успешно испратена")
            setTimeout(() => {  
              this.contactModal = false;
          }, 3000);
          } else {
            this.loading = false;
            this.presentToast("top", "Настана проблем, обидете се повторно")
          }
        })
    } else {
      this.loading = false;
    }
  }

 

  getUserById(userId){
    this.loading = true;
    this.authService.getUserById(userId).subscribe(data => { 
      if(data != null){
       this.fillUserForm(data)
       this.employeeId = data.userId;
       this.empForm.controls["userId"].setValue(data.userId.toString())
       console.log(data);
       for(let i = 0; i < data.roles.length; i++){
        if(!data.roles[i].name.includes("ROLE_USER")){
          this.fillWorkingHoursTable(data.workingHours);
          this.loading = false;
          return;
        }
       }
       this.loading = false;
      } else {
        this.loading = false;
      }
    })
  }

  
  removeMyProfile(){
    this.loading = true;
    this.settingsService.removeMyProfile(this.user.id).subscribe(data => { 
      if(data){
        this.loading = false;
        this.presentToast('top', "Вашиот профил е успешно избришан");
        setTimeout(() => {  
            this.logout();
        }, 1000);
      } else {
        this.loading = false;
      }
    })
  }


  checkRequiredEmployee(){
    if(!this.checkWorkingDateFormat(this.workingHours.controls["mon"].value)){
      this.monError = true;
      return;
    }

    if(!this.checkWorkingDateFormat(this.workingHours.controls["tue"].value)){
      this.tueError = true;
      return;
    }

    if(!this.checkWorkingDateFormat(this.workingHours.controls["wed"].value)){
      this.wedError = true;
      return;
    }

    if(!this.checkWorkingDateFormat(this.workingHours.controls["thu"].value)){
      this.thuError = true;
      return;
    }

    if(!this.checkWorkingDateFormat(this.workingHours.controls["fri"].value)){
      this.friError = true;
      return;
    }

    if(!this.checkWorkingDateFormat(this.workingHours.controls["sat"].value)){
      this.satError = true;
      return;
    }

    if(!this.checkWorkingDateFormat(this.workingHours.controls["sun"].value)){
      this.sunError = true;
      return;
    }
    return true;
  }

  checkWorkingDateFormat(value){
    if(value != ""){
        let parts = value.split("-");
        if(parts.length == 2){
          let leftSide = parts[0].split(":")
          let rightSide = parts[1].split(":")
          if(leftSide.length == 2 && rightSide.length == 2){
            if(leftSide[0].length != 2 || leftSide[1].length != 2 || rightSide[0].length != 2 || rightSide[1].length != 2){
              return false;
            } else {
              var leftHours = Number(leftSide[0]);
              var leftMinutes = Number(leftSide[1]);
              var rightHours = Number(rightSide[0]);
              var rightMinutes = Number(rightSide[1]);
              
              if(leftHours < 0 || leftHours > 23 || leftMinutes < 0 || leftMinutes > 59) {
                  return false;
              } 

              if(rightHours < 0 || rightHours > 23 || rightMinutes < 0 || rightMinutes > 59) {
                return false;
              } 

              if(leftHours > rightHours){
                return false;
              }
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      return true;
    }
    return true;
  }

  checkRequiredUser(){    
    this.submitted = true;
    if (this.userForm.invalid) {
      return false;
    } 

    return true;
  }

  checkRequiredMessage(){    
    this.submitted = true;
    if (this.contactForm.invalid) {
      return false;
    } 

    return true;
  }

  checkRequiredPassword(){    
    this.submitted = true;
    if (this.passForm.invalid) {
      return false;
    } 

    if(this.passForm.controls["newPassword"].value != this.passForm.controls["newPasswordRepeat"].value){
      this.passForm.controls["newPassword"].setValue("");
      this.passForm.controls["newPasswordRepeat"].setValue("");
      this.presentToast('top', "Лозинките не се софпаѓаат");
      return false;
    }

    if(this.passForm.controls["newPassword"].value.length < 8){
      this.presentToast('top', "Лозинкатa мора да содржи минимум 8 карактери");
      return false;
    }

    if(this.passForm.controls["oldPassword"].value == this.passForm.controls["newPassword"].value){
      this.passForm.controls["newPassword"].setValue("");
      this.passForm.controls["newPasswordRepeat"].setValue("");
      this.presentToast('top', "Внете различна лозинка од старата");
      return false;
    }
    
    return true;
  }

  setModalValue(modal, value) {
    if(modal == "settingsModal"){
      this.settingsModal = value;
    }

    if(modal == "documentsModal"){
      this.documentsModal = value;
    }

    if(modal == "myProfileModal"){
      this.getUserById(this.user.id);
      if(this.user.roles.includes("ROLE_USER")){
        this.userProfileModal = value;
      } else if(this.user.roles.includes("ROLE_MODERATOR")) {
        this.isManager = true;
        this.getEmployesByCompany();
        this.employeeProfileModal = value;
      } else {
        this.employeeProfileModal = value;
      }
    }

    if(modal == "passwordModal"){
      this.passwordModal = value;
    }

    if(modal == "removeProfileModal"){
      this.removeProfileModal = value;
    }

    if(modal == "contactModal"){
      this.contactModal = value;
    }
  }

  fillUserForm(data){
    if(data != null){
      let fullName = data.displayName;
      let split = fullName.split(' ');
      this.userForm.controls["name"].setValue(split[0]);
      this.userForm.controls["surname"].setValue(split[1]);
      this.userForm.controls["email"].setValue(data.email);
      this.userForm.controls["phone"].setValue(data.mobile);

      if(data.showForReservation != null && data.showForReservation == 1){
        this.showForReservation = true;
      } else {
        this.showForReservation = false;
      }
    }
  }

  checkboxClick(e){
    let event = e.target.checked;
    if(event){
     this.showForReservation = true;
    } else {
     this.showForReservation = false;
    }
  }

  fillWorkingHoursTable(data){
    if(data != null){
      this.workingHours.controls["mon"].setValue(data.monday);
      this.workingHours.controls["tue"].setValue(data.tuesday);
      this.workingHours.controls["wed"].setValue(data.wednesday);
      this.workingHours.controls["thu"].setValue(data.thursday);
      this.workingHours.controls["fri"].setValue(data.friday);
      this.workingHours.controls["sat"].setValue(data.saturday);
      this.workingHours.controls["sun"].setValue(data.sunday);
    }
  } 

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  get p(): { [key: string]: AbstractControl } {
    return this.passForm.controls;
  }

  get m(): { [key: string]: AbstractControl } {
    return this.contactForm.controls;
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  
  logout(){
    this.authService.removeUserFromStorage();
    this.router.navigate(['/hidden-login']);
  }
}
