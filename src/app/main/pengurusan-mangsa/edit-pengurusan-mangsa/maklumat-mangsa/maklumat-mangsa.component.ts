import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-maklumat-mangsa',
	templateUrl: './maklumat-mangsa.component.html'
})
export class MaklumatMangsaComponent implements OnInit {
	dun = [{ data: 'DUN Bukau' }, { data: 'DUN Mentari' }];

	districts = [{ data: 'Tebrau' }, { data: 'Kuala Pilah' }];

	parliaments = [{ data: 'Kuantan' }, { data: 'Seremban' }];

	states = [{ data: 'Pahang' }, { data: 'Selangor' }];

	constructor() {}

	ngOnInit(): void {}
}
