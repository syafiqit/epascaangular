import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-add-direct-payment',
  templateUrl: './add-direct-payment.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddDirectPaymentComponent implements OnInit {

  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';

  constructor() { }

  ngOnInit(): void {
  }

}
