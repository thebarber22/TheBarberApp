import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'date'
})

export class DatePipe implements PipeTransform {

    transform(value: any) {
        const date = value.split("-")
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

}