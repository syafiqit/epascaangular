import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {
	RefDaerahServiceProxy,
  RefBencanaNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';

@Component({
  selector: 'app-tambah-edit-kawasan-bantuan',
  templateUrl: './tambah-edit-kawasan-bantuan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditKawasanBantuanComponent implements OnInit {
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
  id_bencana: any;

	constructor(
		public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refBencanaServiceProxy: RefBencanaNegeriServiceProxy
	) {
    this.id_bencana = this._activatedRoute.snapshot.queryParams['idBencana'];
  }

	ngOnInit(): void {
		this.getNegeri();
	}

	getNegeri(filter?) {
		this._refBencanaServiceProxy.getRefBencanaNegeriForDropdownByIdBencana(filter, this.id_bencana).subscribe((result) => {
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

