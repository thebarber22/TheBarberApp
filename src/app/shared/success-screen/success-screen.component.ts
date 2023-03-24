import { Component, Input, OnInit } from '@angular/core';
import { ReserveButtonComponent } from '../../shared/reserve-button/reserve-button.component'

@Component({
  selector: 'app-success-screen',
  templateUrl: './success-screen.component.html',
  styleUrls: ['./success-screen.component.scss'],
})
export class SuccessScreenComponent implements OnInit {

  @Input() reserve?:ReserveButtonComponent
  @Input() employee;
  @Input() services;
  @Input() start;
  
  constructor() { }

  ngOnInit() {}

  formatString(){
    if(this.services != null && this.services != ""){
      return this.services.slice(0, this.services.length-2);
    }
  }
}
