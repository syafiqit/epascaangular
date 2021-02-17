import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-bantuan-antarabangsa',
	templateUrl: './bantuan-antarabangsa.component.html'
})
export class BantuanAntarabangsaComponent implements OnInit {
	constructor(public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
