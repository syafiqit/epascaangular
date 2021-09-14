import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
	RefNegeriServiceProxy,
	RefDaerahServiceProxy,
  RefBencanaNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-tambah-bantuan',
	templateUrl: './tambah-bantuan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahBantuanComponent implements OnInit {
  @Input() id;

  states: any;
  districts: any;
  filterIdNegeri: number;
  negeriModel: any;
  daerahModel: any;
  idNegeri: number;
  idDaerah: number;
  nama_negeri: string;
  nama_daerah: string;
  jumlah_bayaran: number;
  filter: string;

	constructor(
		public activeModal: NgbActiveModal,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refBencanaServiceProxy: RefBencanaNegeriServiceProxy
	) {}

	ngOnInit(): void {
		this.getNegeri();
	}

	getNegeri(filter?) {
		this._refBencanaServiceProxy.getRefBencanaNegeriForDropdownByIdBencana(filter, this.id).subscribe((result) => {
			this.states = result.items;

		});
	}

  getNamaNegeri(){
    this.idNegeri = this.negeriModel.id_negeri;
    this.nama_negeri = this.negeriModel.nama_negeri;
    this.getDaerah(this.idNegeri);
  }

  getNamaDaerah(){
    this.idDaerah = this.daerahModel.id;
    this.nama_daerah = this.daerahModel.nama_daerah;
  }

	getDaerah(idNegeri) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(this.filter, idNegeri).subscribe((result) => {
			this.districts = result.items;
		});
	}

  save(){
    this.activeModal.close({
      id_negeri: this.idNegeri,
      id_daerah: this.idDaerah,
      nama_negeri: this.nama_negeri,
      nama_daerah: this.nama_daerah,
      jumlah_bayaran: this.jumlah_bayaran
    });
  }
}
