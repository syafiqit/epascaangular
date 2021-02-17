import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-mangsa-bencana',
	templateUrl: './tambah-edit-mangsa-bencana.component.html'
})
export class TambahEditMangsaBencanaComponent implements OnInit {
	constructor(public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
