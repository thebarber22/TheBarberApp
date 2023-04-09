import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/login/services/auth.service';

@Pipe({
  name: 'date'
})

export class DatePipe implements PipeTransform {
  selectedLang: any;
  constructor(private authService: AuthService,
              private translate: TranslateService) {};
    
    async transform(value: any) {
        await this.authService.getLanguage().then(lang => {
          if(lang != null && lang != undefined && lang != ""){
            this.selectedLang = lang;
          } else {
            this.selectedLang = this.translate.getDefaultLang()
          }
        });    

        const date = value.split("-")

        if(this.selectedLang == "mk"){
          switch (date[1]) {
                    case '01': return "Јануари " + date[2]; 
                    case '02': return "Февруари " + date[2];
                    case '03': return "Март " + date[2];
                    case '04': return "Април " + date[2];
                    case '05': return "Мај " + date[2];
                    case '06': return "Јуни " + date[2];
                    case '07': return "Јули " + date[2];
                    case '08': return "Август " + date[2];
                    case '09': return "Септември " + date[2];
                    case '10': return "Октовмри " + date[2];
                    case '11': return "Ноември " + date[2];
                    case '12': return "Декември " + date[2];
              default: return date;
            }
        }

        if(this.selectedLang == "en"){
          switch (date[1]) {
                    case '01': return "January " + date[2]; 
                    case '02': return "February " + date[2];
                    case '03': return "March " + date[2];
                    case '04': return "April " + date[2];
                    case '05': return "May " + date[2];
                    case '06': return "June " + date[2];
                    case '07': return "July " + date[2];
                    case '08': return "August " + date[2];
                    case '09': return "September " + date[2];
                    case '10': return "October " + date[2];
                    case '11': return "November " + date[2];
                    case '12': return "December " + date[2];
              default: return date;
            }
        } 
  
        if(this.selectedLang == "al"){
          switch (date[1]) {
                    case '01': return "Janar " + date[2]; 
                    case '02': return "Shkurt " + date[2];
                    case '03': return "Mars " + date[2];
                    case '04': return "Prill " + date[2];
                    case '05': return "Maj " + date[2];
                    case '06': return "Qershor " + date[2];
                    case '07': return "Korrik " + date[2];
                    case '08': return "Gusht " + date[2];
                    case '09': return "Shtator " + date[2];
                    case '10': return "Tetor " + date[2];
                    case '11': return "Nëntor " + date[2];
                    case '12': return "Dhjetor " + date[2];
              default: return date;
            }
        }
    }
}