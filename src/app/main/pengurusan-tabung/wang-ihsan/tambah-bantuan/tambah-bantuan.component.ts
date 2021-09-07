import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
	RefNegeriServiceProxy,
	RefDaerahServiceProxy
} from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-tambah-bantuan',
	templateUrl: './tambah-bantuan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahBantuanComponent implements OnInit {

  states: any;
  districts: any;
  filterIdNegeri: number;
  namaNegeri: any;
  namaDaerah: any;
  jumlah_bayaran: number;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy
	) {}

	ngOnInit(): void {
		this.getNegeri();
    this.getDaerah();
	}

	getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

	getDaerah(filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterIdNegeri).subscribe((result) => {
			this.districts = result.items;
		});
	}
}
