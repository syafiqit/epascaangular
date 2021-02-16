import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-add-household',
	templateUrl: './add-household.component.html'
})
export class AddHouseholdComponent implements OnInit {
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
