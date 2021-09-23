import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tambah-jumlah-bwi',
  templateUrl: './tambah-jumlah-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahJumlahBwiComponent implements OnInit {

  @Input() name;
	@Input() id;

	saving = true;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal
	) {}

  ngOnInit(): void { 
  }

}
