import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-edit-kelulusan',
	templateUrl: './edit-kelulusan.component.html',
	encapsulation: ViewEncapsulation.None
})
export class EditKelulusanComponent implements OnInit {
	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';

	constructor() {}

	ngOnInit(): void {}
}
