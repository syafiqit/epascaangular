import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-rujukan',
	templateUrl: './rujukan.component.html'
})
export class RujukanComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}

	test() {
		window.open('assets/images/ManualPengguna.pdf');
	}
}
