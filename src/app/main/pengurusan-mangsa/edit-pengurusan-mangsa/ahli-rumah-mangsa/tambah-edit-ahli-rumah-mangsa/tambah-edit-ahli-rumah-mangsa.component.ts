import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-ahli-rumah-mangsa',
	templateUrl: './tambah-edit-ahli-rumah-mangsa.component.html'
})
export class TambahEditAhliRumahMangsaComponent implements OnInit {
	relationships = [
		{ data: 'Ayah' },
		{ data: 'Ibu' },
		{ data: 'Abang' },
		{ data: 'Kakak' },
		{ data: 'Adik Lelaki' },
		{ data: 'Adik Perempuan' }
	];

	constructor(public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
