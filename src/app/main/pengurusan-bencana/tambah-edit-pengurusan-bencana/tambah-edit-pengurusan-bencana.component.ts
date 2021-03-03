import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@node_modules/@ng-bootstrap/ng-bootstrap';
import { ToastrService } from '@node_modules/ngx-toastr';

@Component({
	selector: 'app-tambah-edit-pengurusan-bencana',
	templateUrl: './tambah-edit-pengurusan-bencana.component.html'
})
export class TambahEditPengurusanBencanaComponent implements OnInit {
	negeri = [{ name: 'Kuala Lumpur' }, { name: 'Selangor' }, { name: 'Terengganu' }];

	@Input() name;
	constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private toaster: ToastrService) {}

	ngOnInit(): void {}
}
