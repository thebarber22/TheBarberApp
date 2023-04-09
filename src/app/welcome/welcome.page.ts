import { Component, OnInit} from '@angular/core';
import { AuthService } from '../login/services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  isModalOpen = false;
  token:any;
  user:any;
  selectedLang:any;
  
 constructor(private router: Router,
             private authService: AuthService,
             private translate: TranslateService){}

  ngOnInit() {
    this.checkDefaultLanguage();
    this.checkUser();
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

  async goToLogin(){
    this.router.navigate(["/login"]);
  }

  async checkUser(){
    await this.authService.getToken().then(res => {
      this.token = res;
    })
    await this.authService.getUser().then(res => {
      this.user = res;
    })
    setTimeout(() => {  
      if(this.token != null && this.user != null){
        this.router.navigate(['home'])
     }
    }, 100);
  }
}
