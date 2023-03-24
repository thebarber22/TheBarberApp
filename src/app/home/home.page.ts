import { Component, NgZone } from '@angular/core';
import { EmployeeServiceService } from '../employee/services/employee-service.service';
import { HomeService } from './services/home.service';
import { AuthService } from '../login/services/auth.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { lang } from 'moment';

@Component({
  selector: 'app-home', 
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  companyId = environment.companyId;
  employees: any = [];
  company : any;
  public loading:Boolean=false;
  user : any;
  token : any;
  sharedData: string;
  newNotification : any = false;
  isOpen : any = false;
  notifications : any = [];
  selectedLang = ''

  constructor(private empserservice: EmployeeServiceService,
              private homeService: HomeService, 
              private router: Router,
              private auth : AuthService,
              private ngZone: NgZone,
              private r:ActivatedRoute,
              private translate: TranslateService) {
                this.selectedLang = translate.getDefaultLang()
                console.log(this.selectedLang)
                r.params.subscribe(val => {
                  this.checkNotifications();
                  this.homeService.sharedData$.subscribe(sharedData => {
                    if(sharedData != null && sharedData != undefined){
                      this.ngZone.run(() => {
                        this.newNotification = true;
                      });
                    }
                  });
                });
              }

  async ngOnInit() {
    await this.getCompanyInfo();
    this.checkIfUserExist();
    window.sessionStorage.removeItem("succ-reservs");
    window.sessionStorage.removeItem("employee");
  }

  ngAfterViewInit(){
    this.checkNotifications();
  }

  async checkNotifications(){
    this.notifications = [];
    await this.homeService.getAllNotifications().subscribe(res => {
      if(res != null && res != undefined){
        this.notifications = res;
        this.notifications.reverse();
        if(this.notifications != null){
          if(this.notifications[0]?.newNotification==1){
            this.newNotification = true;
          }
        }
      }      
    })
  }

  async getNotifications(){
    this.notifications = [];
    await this.homeService.getAllNotifications().subscribe(res => {
      if(res != null){
        this.notifications = res;
        this.notifications.reverse();
        this.isOpen = true;
        this.updateNotificationStatus();
      }
    })
  }

  removeNotification(id, index){
    this.notifications.splice(index, 1); 
    this.homeService.removeNotifications(id).subscribe(res => {
      this.newNotification = false;
    })
  }

  updateNotificationStatus(){
    if(this.newNotification){
      this.newNotification = false;
      this.homeService.changeNotificationStatus().subscribe(res => {})
    }
  }

  async getCompanyInfo(){
    this.loading=true;
    this.homeService.getCompanyById().subscribe(res => {
      this.company=res;
      this.auth.saveCompany(res);

      if(this.company.packagePlan != null){
        let endDate : Date = new Date(this.company.packagePlan.endDateTime);
        if(endDate != null) {
          let today = new Date();
          if(endDate < today) {
            this.router.navigate(['expired-subscription'])
          }
        }
      }
    },()=>{this.loading=false}, ()=> {
      this.getEmpByCompanyId(); 
      this.loading=false; 
    })
  }

  async checkIfUserExist() {
    await this.auth.getToken().then(res => {
      this.token = res;
    })
    await this.auth.getUser().then(res => {
      this.user = res;
    })

    if(this.token == null || this.user == null){
      this.router.navigate(['welcome'])
    }
  }

  async getEmpByCompanyId(){
    this.loading=true;
    this.empserservice.getEmployeesByCompanyId(this.companyId).subscribe(res => {
      for(let i = 0; i < res.length; i++){
        if(res[i]?.showForReservation == 1){
          this.employees.push(res[i]);
        }
      }
    },()=>{this.loading=false}, ()=> {this.loading=false})
  }

  openBarber(emp){
    window.sessionStorage.removeItem("employee");
    window.sessionStorage.setItem("employee", JSON.stringify(emp));
    this.router.navigate(['employee', emp.userId])
  }

  changeLanguage(language: string) {
    this.selectedLang=language
    this.translate.use(language);
  }
}
