import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-tambah-edit-wang-ihsan',
	templateUrl: './tambah-edit-wang-ihsan.component.html'
})
export class TambahEditWangIhsanComponent implements OnInit {
	state = [
		{ state: 'Johor' },
		{ state: 'Kedah' },
		{ state: 'Kelantan' },
		{ state: 'Melaka' },
		{ state: 'Negeri Sembilan' },
		{ state: 'Pahang' },
		{ state: 'Perak' },
		{ state: 'Perlis' },
		{ state: 'Pulau Pinang' },
		{ state: 'Sabah' },
		{ state: 'Sarawak' },
		{ state: 'Selangor' },
		{ state: 'Terengganu' },
		{ state: 'Wilayah Persekutuan K.L' }
	];

	constructor() {}

	ngOnInit(): void {}
}
