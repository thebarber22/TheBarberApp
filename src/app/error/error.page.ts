import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorPage implements OnInit {
  selectedLang: any;
  constructor(private router: Router,
    private translate: TranslateService,
    private authService : AuthService) { }

  ngOnInit() {
    this.checkDefaultLanguage();
  }

  async checkDefaultLanguage(){
    await this.authService.getLanguage().then(lang => {
      if(lang != null && lang != undefined && lang != ""){
        this.selectedLang = lang;
        this.translate.use(lang);
      } else {
        this.selectedLang = this.translate.getDefaultLang();
        this.translate.use(this.selectedLang);
      }
    });   
  }


  goBack(){
    this.router.navigate(['home'])
  }

}
