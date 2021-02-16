import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-victim-profile',
	templateUrl: './victim-profile.component.html'
})
export class VictimProfileComponent implements OnInit {
	dun = [{ data: 'DUN Bukau' }, { data: 'DUN Mentari' }];

	districts = [{ data: 'Tebrau' }, { data: 'Kuala Pilah' }];

	parliaments = [{ data: 'Kuantan' }, { data: 'Seremban' }];

	states = [{ data: 'Pahang' }, { data: 'Selangor' }];

	constructor() {}

	ngOnInit(): void {}
}
