import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-tambah-edit-pinjaman-usahawan',
	templateUrl: './tambah-edit-pinjaman-usahawan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditPinjamanUsahawanComponent implements OnInit {
	@Input() name;

	constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private toaster: ToastrService) {}

	ngOnInit(): void {}

	status = [{ status: 'Aktif' }, { status: 'Tidak Aktif' }];
}
