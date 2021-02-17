import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-bantuan-lain',
	templateUrl: './bantuan-lain.component.html'
})
export class BantuanLainComponent implements OnInit {
	constructor(public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
