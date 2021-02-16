import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-approval-edit',
	templateUrl: './approval-edit.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ApprovalEditComponent implements OnInit {
	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';

	constructor() {}

	ngOnInit(): void {}
}
