import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-tambah-edit-bayaran-secara-terus',
	templateUrl: './tambah-edit-bayaran-secara-terus.component.html',
	encapsulation: ViewEncapsulation.None
})
export class TambahEditBayaranSecaraTerusComponent implements OnInit {
	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';

	constructor() {}

	ngOnInit(): void {}
}
