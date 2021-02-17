import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

@Component({
	selector: 'app-tambah-pengurusan-mangsa',
	templateUrl: './tambah-pengurusan-mangsa.component.html'
})
export class TambahPengurusanMangsaComponent implements OnInit {
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
