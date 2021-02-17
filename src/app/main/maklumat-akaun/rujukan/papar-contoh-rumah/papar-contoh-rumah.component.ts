import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-papar-contoh-rumah',
	templateUrl: './papar-contoh-rumah.component.html'
})
export class PaparContohRumahComponent implements OnInit {
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
