import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tukar-kata-laluan',
	templateUrl: './tukar-kata-laluan.component.html'
})
export class TukarKataLaluanComponent implements OnInit {
	constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
