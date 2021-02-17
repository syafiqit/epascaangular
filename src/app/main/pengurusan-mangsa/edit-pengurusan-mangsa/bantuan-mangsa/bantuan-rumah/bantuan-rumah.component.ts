import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-bantuan-rumah',
	templateUrl: './bantuan-rumah.component.html'
})
export class BantuanRumahComponent implements OnInit {
	options$: Observable<number[]>;
	constructor(public activeModal: NgbActiveModal) {
		this.options$ = of([1, 2, 3, 4, 5, 6]);
	}

	ngOnInit(): void {}
}
