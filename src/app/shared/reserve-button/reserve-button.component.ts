import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reserve-button',
  templateUrl: './reserve-button.component.html',
  styleUrls: ['./reserve-button.component.scss'],
})
export class ReserveButtonComponent implements OnInit {

  @Output() nextStep = new EventEmitter<Boolean>();
  @Input() text:string;
  constructor() { }

  ngOnInit() {}

  toNextStep(){
    this.nextStep.emit(true)
  }

}
