import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSlides, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Service } from '../employee/model/Service';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { User } from '../login/models/User';
import { AuthService } from '../login/services/auth.service';
import { CompanyDTO } from '../shared/models/CompanyDTO';
import { MailDTO } from '../shared/models/MailDTO';
import { SettingsService } from './services/settings.service';
import { PasswordDTO } from '../shared/models/passwordDTO';


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
  serviceDetail = false;
  settingsModal = false;
  documentsModal = false;
  myProfileModal = false;
  employeeProfileModal = false;
  userProfileModal = false;
  passwordModal = false;
  removeProfileModal = false;
  contactModal = false;
  serviceModal = false;
  companyModal = false;
  userForm: FormGroup;
  passForm: FormGroup;
  workingHours: FormGroup;
  empForm: FormGroup;
  contactForm: FormGroup;
  serviceForm : FormGroup;
  companyForm : FormGroup;
  submitted = false;
  user;
  companyId = environment.companyId;
  userDTO : User;
  passwordDTO : PasswordDTO;
  companyDTO : CompanyDTO;
  mailDTO : MailDTO;
  employees = [];
  isManager = false;
  employeeId = "";
  showForReservation = false;
  servicesList = [];
  isUser = false;
  segment: string = "all";
  selectedServiceId;
  notificationStatus = false;
  serviceDTO: Service;
  serviceDetailsUsers = [];
  availableLanguages = [];
  @ViewChild(IonSlides, { static: false }) slides: IonSlides;
  selectedLang: any;
  serviceName : any = "";
  images: any = [];
  selectedServiceForOpen : any;
  constructor(private authService : AuthService,
              private router: Router,
              private fb: FormBuilder,
              private settingsService : SettingsService,
              private toastController : ToastController,
              private employeeService : EmployeeServiceService,
              private alertController: AlertController,
              private translate: TranslateService,
              public datepipe: DatePipe,
              private r:ActivatedRoute) {
                this.userForm = this.fb.group({
                  name : ['', Validators.required],
                  surname : [''],
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
                this.serviceForm = this.fb.group({
                  name : ['', Validators.required],
                  description : [''],
                  price : ['', Validators.required],
                  duration : ['', Validators.required],
                  language: ['', Validators.required]
                })
                this.companyForm = this.fb.group({
                  name : ['', Validators.required],
                  address : ['', Validators.required],
                  mobilePhone : ['', Validators.required],
                  availableUntill: ['', Validators.required],
                  packagePlan: ['', Validators.required],
                })

                r.params.subscribe(val => {
                  this.ngOnInit();
                });
              }

  ngOnInit() {
    this.getUserFromStorage();
    this.checkDefaultLanguage();
    this.getCompanyInfo();
  }


  checkDefaultLanguage(){
    this.authService.getLanguage().then(lang => {
      if(lang != null && lang != undefined && lang != ""){
        this.selectedLang = lang;
        this.translate.use(lang);
      } else {
        this.selectedLang = this.translate.getDefaultLang()
        this.translate.use(this.translate.getDefaultLang());
      }
    });    
  }

  async getUserFromStorage(){
    await this.authService.getUser().then(res => {
      this.user = JSON.parse(res)
      this.getUserById(this.user.id)
    })
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
          this.translate.get('dataUpdateSucc').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
          this.loading = false;
        } else {
          this.translate.get('problemOccurred').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
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
          this.translate.get('dataUpdateSucc').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
        } else {
          this.loading = false;
          this.translate.get('problemOccurred').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
        }
      });
    } else {
      this.translate.get('validEmpTimeFormat').subscribe((translatedString) => {
        this.presentToast('top', translatedString);
      })
      this.loading = false;
    }
  }

  changePass(){
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
          this.submitted = false;
          this.translate.get('passwordChangeSucc').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
          setTimeout(() => {  
            this.passwordModal = false;
          }, 2000);
        } else {
          this.loading = false;
          this.translate.get('problemOccurred').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
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
        this.mailDTO.userId = this.user.id;
        this.settingsService.sendMessage(this.mailDTO).subscribe(data => { 
          if(data == true){
            this.loading = false;
            this.translate.get('messageSuccSent').subscribe((translatedString) => {
              this.presentToast('top', translatedString);
            })
            setTimeout(() => {  
              this.contactModal = false;
          }, 3000);
          } else {
            this.loading = false;
            this.translate.get('problemOccurred').subscribe((translatedString) => {
              this.presentToast('top', translatedString);
            })
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
       for(let i = 0; i < data.roles.length; i++){
        if(data.roles[i].name.includes("ROLE_EMPLOYEE") || data.roles[i].name.includes("ROLE_MODERATOR")){
          this.fillWorkingHoursTable(data.workingHours);
          this.loading = false;
          if(data.roles[i].name.includes("ROLE_MODERATOR")){
            this.isManager = true;
          }
          return;
        } 
       }

       if(data.enabled == 1){
          this.notificationStatus = true;
       } else {
          this.notificationStatus = false;
       }

       this.loading = false;
      } else {
        this.loading = false;
      }
    })
  }


  createNewService(){
    this.loading = true;
    this.serviceDTO = new Service();
    this.serviceDTO.companyId = this.companyId;
    this.serviceDTO.description = this.serviceForm.controls["description"].value;;
    this.serviceDTO.name = this.serviceForm.controls["name"].value;
    this.serviceDTO.price = this.serviceForm.controls["price"].value;;
    this.serviceDTO.duration = this.serviceForm.controls["duration"].value;
    this.serviceDTO.language = this.serviceForm.controls["language"].value;
    this.slides.getActiveIndex().then((index) => {
      this.serviceDTO.image = this.images[index];
    }) 

    if(this.checkRequiredService()){
      this.settingsService.createNewService(this.serviceDTO).subscribe(data => { 
        if(data){
          this.loading = false;
          this.translate.get('serviceSuccCreated').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
          this.submitted = false;
          this.getServiceByCompany(this.companyId);
          this.serviceForm.reset();
          setTimeout(() => {  
              this.segment = "all";
          }, 1000);
        } else { 
          this.translate.get('problemOccurred').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
          this.loading = false;
        }
      })
    } else {
      this.translate.get('invalidDataEntry').subscribe((translatedString) => {
        this.presentToast('top', translatedString);
      })
      this.loading = false;
    }    
  }

  updateService(){
    this.loading = true;
    this.serviceDTO = new Service();
    this.serviceDTO.companyId = this.companyId;
    this.serviceDTO.description = this.serviceForm.controls["description"].value;;
    this.serviceDTO.name = this.serviceForm.controls["name"].value;
    this.serviceDTO.price = this.serviceForm.controls["price"].value;;
    this.serviceDTO.duration = this.serviceForm.controls["duration"].value;
    this.serviceDTO.serviceId = this.selectedServiceId;
    this.serviceDTO.language = this.serviceForm.controls["language"].value;
    this.slides.getActiveIndex().then((index) => {
      this.serviceDTO.image = this.images[index];
    }) 

    if(this.checkRequiredService()){
      this.settingsService.updateService(this.serviceDTO).subscribe(data => { 
        if(data){
          this.loading = false;
          this.translate.get('dataUpdateSucc').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
          this.getServiceByCompany(this.companyId);
          setTimeout(() => {  
              this.segment = "all";
          }, 1000);
        } else { 
          this.translate.get('problemOccurred').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
          this.loading = false;
        }
      })
    } else {
      this.translate.get('invalidDataEntry').subscribe((translatedString) => {
        this.presentToast('top', translatedString);
      })
      this.loading = false;
    }    
  }

  changeUpdateServiceLanguage(){
    let lang = this.serviceForm.controls["language"].value;
    let flag = false;

    for(let i = 0; i < this.selectedServiceForOpen.serviceInfoList.length; i++){
      if(this.selectedServiceForOpen.serviceInfoList[i].language == lang){
        this.serviceForm.controls["name"].setValue(this.selectedServiceForOpen.serviceInfoList[i].name)
        this.serviceForm.controls["description"].setValue(this.selectedServiceForOpen.serviceInfoList[i].description)
        flag = true;
      }
    }

    if(!flag) {
      this.translate.get('enterTitleAndDesc').subscribe((translatedString) => {
        this.presentToast('top', translatedString);
      })
      this.serviceForm.controls["name"].setValue("");
      this.serviceForm.controls["description"].setValue("");
    }


  }

  
  removeMyProfile(){
    this.loading = true;
    this.settingsService.removeMyProfile(this.user.id).subscribe(data => { 
      if(data){
        this.loading = false;
        this.translate.get('yourProfileSuccRemoved').subscribe((translatedString) => {
          this.presentToast('top', translatedString);
        })
        setTimeout(() => {  
            this.logout();
        }, 1000);
      } else {
        this.loading = false;
      }
    })
  }


  async removeServiceAlert(id) {
    let caution: any;
    let message: any;
    let yes: any;
    this.translate.get('yes').subscribe((translatedString) => {
      message = translatedString;
    })
    this.translate.get('caution').subscribe((translatedString) => {
      caution = translatedString;
    })
    this.translate.get('removeServiceFromEmpQ').subscribe((translatedString) => {
      message = translatedString;
    })
    const alert = await this.alertController.create({
      header: caution,
      message: message,
      buttons: [{
          text: 'Да',
          role: 'confirm',
          handler: () => {
             this.removeServiceFromEmployee(id, this.employeeId, true)
          },
        },
    ],
    });

    await alert.present();
  }


  async removeServiceDetailAlert(id){
    let caution : any;
    let message : any;
    let yes: any;
    this.translate.get('yes').subscribe((translatedString) => {
      message = translatedString;
    })
    this.translate.get('caution').subscribe((translatedString) => {
      caution = translatedString;
    })
    this.translate.get('removeServiceFromAllEmpQ').subscribe((translatedString) => {
      message = translatedString;
    })
   
    const alert = await this.alertController.create({
      header: caution,
      message: message,
      buttons: [{
          text: yes,
          role: 'confirm',
          handler: () => {
             this.removeServiceFromCompany(id)
          },
        },
    ],
    });

    await alert.present();
  }

  removeServiceFromCompany(serviceId){
    this.loading = true;
    this.settingsService.removeServiceFromCompany(serviceId).subscribe(data => { 
      if(data){
        this.loading = false;
        this.translate.get('serviceSuccRemoved').subscribe((translatedString) => {
          this.presentToast('top', translatedString);
        })
        this.getServiceByCompany(this.companyId);
      } else {
        this.loading = false;
        this.translate.get('problemOccurred').subscribe((translatedString) => {
          this.presentToast('top', translatedString);
        })
      }
    })
  }

  async removeServiceFromEmployee(serviceId, employeeId, getUser){
    this.loading = true;
    await this.settingsService.removeServiceFromEmp(serviceId, employeeId).subscribe(data => { 
      if(data){
        this.translate.get('serviceSuccRemoved').subscribe((translatedString) => {
          this.presentToast('top', translatedString);
        })
        if(getUser==true){
          this.getUserById(employeeId);
        } else {
          this.getServiceDetails(this.selectedServiceId);
        }
      } else {
        this.loading = false;
        this.translate.get('problemOccurred').subscribe((translatedString) => {
          this.presentToast('top', translatedString);
        })
      }
    })
  }

  openService(service, value){
    this.loading = true;
    this.serviceDetail = value;
    this.selectedServiceForOpen = service;
    if(service != ""){
      for(let i = 0; i < service.serviceInfoList.length; i++){
        if(service.serviceInfoList[i].language == this.selectedLang){
          this.serviceName = service.serviceInfoList[i].name
        }
      }
      this.getServiceDetails(service.serviceId);
      this.fillServiceForm(service)
    } else {
      this.loading = false;
    }
  }

  fillServiceForm(service){
    this.loading = true;
    if(service != null){
      [service.image].concat(this.images);
      this.serviceForm.controls["price"].setValue(service.price);
      this.serviceForm.controls["duration"].setValue(service.duration);

      for(let i = 0; i < service.serviceInfoList.length; i++){
        if(service.serviceInfoList[i].language == this.selectedLang) {
          this.serviceForm.controls["name"].setValue(service.serviceInfoList[i].name);
          this.serviceForm.controls["description"].setValue(service.serviceInfoList[i].description);
          this.serviceForm.controls["language"].setValue(service.serviceInfoList[i].language);
        } else {
          this.serviceForm.controls["name"].setValue(service.serviceInfoList[0].name);
          this.serviceForm.controls["description"].setValue(service.serviceInfoList[0].description);
          this.serviceForm.controls["language"].setValue(service.serviceInfoList[0].language);
        }
      }
      this.loading = false;
    } else {
      this.loading = false;
    }
  }

  getServiceDetails(serviceId){
    this.selectedServiceId = serviceId;
    this.serviceDetailsUsers = [];
    this.settingsService.getServiceDetails(serviceId).subscribe(data => { 
      if(data != null){
        this.serviceDetailsUsers = data;
        this.loading = false;
      } else {
        this.loading = false;
      }
    })
  }

  removeSelectedServiceFromEmp(serviceId, empId){   
    this.loading = true;
    this.removeServiceFromEmployee(serviceId, empId, false);
  }

  addServiceToEmployee(serviceId, empId){
    this.loading = true;
    this.settingsService.addServiceToEmp(serviceId, empId).subscribe(data => { 
      if(data){
        this.loading = false;
        this.translate.get('serviceSuccAdded').subscribe((translatedString) => {
          this.presentToast('top', translatedString);
        })
        this.getServiceDetails(serviceId)
      } else {
        this.loading = false;
        this.translate.get('problemOccurred').subscribe((translatedString) => {
          this.presentToast('top', translatedString);
        })
      }
    })
  }

  
  updateCompany(){
    this.loading = true;
    if(this.checkCompanyRequired()){
      this.companyDTO = new CompanyDTO;
      this.companyDTO.companyId = this.companyId;
      this.companyDTO.name = this.companyForm.controls["name"].value;
      this.companyDTO.address = this.companyForm.controls["address"].value;
      this.companyDTO.mobilePhone = this.companyForm.controls["mobilePhone"].value;
      this.settingsService.updateCompany(this.companyDTO).subscribe(data => { 
        if(data){
          this.loading = false;
          this.translate.get('dataUpdateSucc').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
          this.authService.saveCompany(data);
        } else {
          this.loading = false;
          this.translate.get('problemOccurred').subscribe((translatedString) => {
            this.presentToast('top', translatedString);
          })
        }
      })
    }
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
  segmentChanged(ev: any) {
    this.serviceForm.reset();
    this.serviceForm.controls["language"].setValue(this.selectedLang);
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

  checkRequiredService(){    
    this.submitted = true;
    if (this.serviceForm.invalid) {
      return false;
    } 

    return true;
  }

  checkCompanyRequired(){
    this.submitted = true;
    if (this.companyForm.invalid) {
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
      this.translate.get('passwordNotMatch').subscribe((translatedString) => {
        this.presentToast('top', translatedString);
      })
      return false;
    }

    if(this.passForm.controls["newPassword"].value.length < 8){
      this.translate.get('passwordMinCharacters').subscribe((translatedString) => {
        this.presentToast('top', translatedString);
      })
      return false;
    }

    if(this.passForm.controls["oldPassword"].value == this.passForm.controls["newPassword"].value){
      this.passForm.controls["newPassword"].setValue("");
      this.passForm.controls["newPasswordRepeat"].setValue("");
      this.translate.get('differentPasswords').subscribe((translatedString) => {
        this.presentToast('top', translatedString);
      })
      return false;
    }
    
    return true;
  }

  setModalValue(modal, value) {
    this.loading = false;
    if(modal == "settingsModal"){
      this.settingsModal = value;
    }

    if(modal == "documentsModal"){
      this.documentsModal = value;
    }

    if(modal == "myProfileModal"){
      this.getUserById(this.user.id);
      if(this.user.roles.includes("ROLE_USER")){
        this.isUser = true;
        this.userProfileModal = value;
      } else if(this.user.roles.includes("ROLE_MODERATOR")) {
        this.isManager = true;
        this.getEmployesByCompany();
        this.employeeProfileModal = value;
        this.isUser = false;
      } else {
        this.employeeProfileModal = value;
        this.isUser = false;
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

    if(modal == "serviceModal"){
      this.getServiceByCompany(this.companyId);
      this.serviceModal = value;
      this.getAllServiceImages();
    }

    if(modal == "companyModal"){
      this.fillCompanyForm();
      this.companyModal = value;
    }
  }

  async fillCompanyForm(){
    await this.authService.getCompany().then(res => {
      let company = JSON.parse(res)
      this.companyForm.controls["name"].setValue(company.name);
      this.companyForm.controls["address"].setValue(company.address);
      this.companyForm.controls["mobilePhone"].setValue(company.mobilePhone);

      if(company.packagePlan != null) {
        this.companyForm.controls["packagePlan"].setValue(company.packagePlan.packagePlanName);
        let dateTimeEnd = this.datepipe.transform(company.packagePlan.endDateTime, "dd-MM-YYYY hh:mm a")
        this.companyForm.controls["availableUntill"].setValue(dateTimeEnd);
      }
    })
  }

  getServiceByCompany(companyId) {
    this.servicesList = [];
    this.loading = true;
    this.settingsService.getServicesByCompany(companyId).subscribe(data => { 
      if(data){
        this.servicesList = data;
        this.loading = false;
      } else {
        this.loading = false;
      }
    })
  }

  async getCompanyInfo() {
    await this.authService.getCompany().then(res => {
      let company = JSON.parse(res)
      if(company != null) {
        this.availableLanguages = company.languages;
      }
    })
  }

  getAllServiceImages(){
    this.settingsService.getServiceImages("BARBER").subscribe(data => { 
      if(data){
        this.images = data;
      }
    })
  }


  
  allowNotification(e){
    let value = "";
    if(e.target.checked){
        value = "0";
    } else {
        value = "1"
    }

    this.settingsService.updateAllowNotification(this.user.id, value).subscribe(data => { 
      if(data){
        this.notificationStatus = !this.notificationStatus;
        this.translate.get('allowNotificationStatus').subscribe((translatedString) => {
          this.presentToast('top', translatedString);
        })
      }
    })
  }

  

  fillUserForm(data){
    this.servicesList = [];
    if(data != null){
      let fullName = data.displayName;
      let split = fullName.split(' ');
      this.userForm.controls["name"].setValue(split[0]);
      this.userForm.controls["surname"].setValue(split[1]);
      this.userForm.controls["email"].setValue(data.email);
      this.userForm.controls["phone"].setValue(data.mobile);


      if(data.employeeServices != null){
        this.servicesList = data.employeeServices
      }

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

  get s(): { [key: string]: AbstractControl } {
    return this.serviceForm.controls;
  }
  get c(): { [key: string]: AbstractControl } {
    return this.companyForm.controls;
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
    this.loading=false;
    this.router.navigate(['/hidden-login']);
  }
}
