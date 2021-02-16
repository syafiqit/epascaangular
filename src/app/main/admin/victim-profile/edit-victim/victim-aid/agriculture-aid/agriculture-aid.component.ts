import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-agriculture-aid',
	templateUrl: './agriculture-aid.component.html'
})
export class AgricultureAidComponent implements OnInit {
	constructor(public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
