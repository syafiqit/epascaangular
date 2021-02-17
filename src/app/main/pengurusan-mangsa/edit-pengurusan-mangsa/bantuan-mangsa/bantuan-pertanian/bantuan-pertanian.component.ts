import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-bantuan-pertanian',
	templateUrl: './bantuan-pertanian.component.html'
})
export class BantuanPertanianComponent implements OnInit {
	constructor(public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
