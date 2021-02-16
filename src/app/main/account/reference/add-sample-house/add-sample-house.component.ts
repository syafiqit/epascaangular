import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-add-sample-house',
	templateUrl: './add-sample-house.component.html'
})
export class AddSampleHouseComponent implements OnInit {
	house = [
		{ name: 'assets/images/sample/sample1.jpg' },
		{ name: 'assets/images/sample/sample2.jpg' },
		{ name: 'assets/images/sample/sample3.jpg' },
		{ name: 'assets/images/sample/sample4.jpg' },
		{ name: 'assets/images/sample/sample5.jpg' },
		{ name: 'assets/images/sample/sample6.jpg' }
	];

	constructor() {}

	ngOnInit(): void {}
}
