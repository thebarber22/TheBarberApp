import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/login/services/auth.service';

@Component({
  selector: 'app-reserve-button',
  templateUrl: './reserve-button.component.html',
  styleUrls: ['./reserve-button.component.scss'],
})
export class ReserveButtonComponent implements OnInit {
  selectedLang : any;
  @Output() nextStep = new EventEmitter<Boolean>();
  @Input() text:string;
  @Input() disabled:boolean = true;
  constructor(private translate: TranslateService,
              private auth: AuthService) { }

  ngOnInit() {
    if(this.text == "Продолжи"){
      this.translate.get('continue').subscribe((translatedString) => {
        this.text = translatedString;
      })
    }

    if(this.text == "Резервирај"){
      this.translate.get('reserve').subscribe((translatedString) => {
        this.text = translatedString;
      })
    }




    this.checkDefaultLanguage();
  }

  async checkDefaultLanguage(){
    await this.auth.getLanguage().then(lang => {
      if(lang != null && lang != undefined && lang != ""){
        this.selectedLang = lang;
        this.translate.use(lang);
      } else {
        this.selectedLang = this.translate.getDefaultLang();
        this.translate.use(this.selectedLang);
      }
    });   
  }

  toNextStep(){
    this.nextStep.emit(true)
  }

}
