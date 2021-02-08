import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-direct-payment',
  templateUrl: './direct-payment.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DirectPaymentComponent implements OnInit {

  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';

  constructor() { }

  ngOnInit(): void {
  }

}
