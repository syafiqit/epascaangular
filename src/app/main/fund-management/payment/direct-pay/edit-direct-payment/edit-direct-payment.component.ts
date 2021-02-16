import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-edit-direct-payment',
	templateUrl: './edit-direct-payment.component.html',
	encapsulation: ViewEncapsulation.None
})
export class EditDirectPaymentComponent implements OnInit {
	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';

	constructor() {}

	ngOnInit(): void {}
}
