import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

@Component({
	selector: 'app-add-victim',
	templateUrl: './add-victim.component.html'
})
export class AddVictimComponent implements OnInit {
	dun = [{ data: 'DUN Bukau' }, { data: 'DUN Mentari' }];

	districts = [{ data: 'Tebrau' }, { data: 'Kuala Pilah' }];

	parliaments = [{ data: 'Kuantan' }, { data: 'Seremban' }];

	states = [{ data: 'Pahang' }, { data: 'Selangor' }];

	options$: Observable<number[]>;
	constructor() {
		this.options$ = of([1, 2, 3, 4, 5, 6]);
	}

	ngOnInit(): void {}
}
