import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import {
  CreateOrEditRefBencanaDto,
  InputCreateBencanaDto,
  RefBencanaServiceProxy,
  RefJenisBencanaServiceProxy,
  RefNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import { TambahJumlahBwiComponent } from './tambah-jumlah-bwi/tambah-jumlah-bwi.component';

@Component({
  selector: 'app-tambah-edit-pengurusan-bencana',
  templateUrl: './tambah-edit-pengurusan-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})

export class TambahEditPengurusanBencanaComponent implements OnInit {

	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

  primengTableHelper: PrimengTableHelper;

	negeriArray:any;
	id:number;

	pengurusan_bencana: InputCreateBencanaDto = new InputCreateBencanaDto();
	bencana: CreateOrEditRefBencanaDto = new CreateOrEditRefBencanaDto();
	saving = true;
	filter: any;
	filterNegeri:any;
	disasters: any;
	states: any;
	tarikhBencana: any;
	dateDisaster: string;

	checkNegeri = false;
  semuaNegeri: any[];
  namaSemuaNegeri: any[];
  state: any[];
  namaNegeri = [];
  negeri:any[];
  negeriCheck:any[];

  date = new Date();
  model: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  rowBwi = [
		{
			bil: '1', jumlah: 'RM 8,000.00' 
		},
		{
			bil: '2', jumlah: 'RM 10,000.00'
		}
	];

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private _activatedRoute: ActivatedRoute,
		private _refBencanaServiceProxy: RefBencanaServiceProxy,
		private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy,
		private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private calendar: NgbCalendar
	) {
		this._activatedRoute.queryParams.subscribe((p) => {
			this.id = p['id'];
		});
		this.primengTableHelper = new PrimengTableHelper();
	 }

	ngOnInit(): void {
		this.show();
		this.getBencana();
		this.getNegeriList();
	}

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        year : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        day : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

	show() {
		if (!this.id) {
			this.pengurusan_bencana = new InputCreateBencanaDto();
			this.bencana = new CreateOrEditRefBencanaDto();
		} else {
			this._refBencanaServiceProxy.getRefBencanaForEdit(this.id).subscribe((result) => {
				this.bencana = result.ref_bencana;

				this.negeri = result.bencanaNegeri


				if(result.ref_bencana.tarikh_bencana){
					this.model = this.fromModel(result.ref_bencana.tarikh_bencana.format('YYYY-MM-DD'));
				}
			});
		}
	}

	getBencana(filter?) {
		this._refJenisBencanaServiceProxy.getRefJenisBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
	}

	getNegeriList() {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(this.filterNegeri).subscribe((result) => {
	      this.state = result.items;

		  let a1 = JSON.stringify(this.state);
		  this.state = JSON.parse(a1);
		  let a2 = JSON.parse(a1);

		  this.negeriCheck = a2.map(val=>{
			return Object.values(val)[0];
		  });

		  this.semuaNegeri = result.items.map((obj) => { return obj.id });
		  this.namaSemuaNegeri = result.items.map((obj) => { return obj.nama_negeri });
		});
	}

	save(): void {
		this.saving = true;

		if(this.model){
		this.dateDisaster = this.toModel(this.model);
		this.bencana.tarikh_bencana = moment(this.dateDisaster, "YYYY-MM-DD");
		this.pengurusan_bencana.id_negeri = this.negeriArray;
		this.pengurusan_bencana.bencana = this.bencana;
		
		this._refBencanaServiceProxy
			.createOrEdit(this.pengurusan_bencana)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if (!this.id) {
					swalSuccess.fire('Berjaya!', 'Maklumat Agensi Berjaya disimpan.', 'success');
				} else if (this.id) {
					swalSuccess.fire('Berjaya!', 'Maklumat Agensi Berjaya dikemaskini.', 'success');
				}
			});
    	}
	}
	
	pilihSemuaNegeri(isChecked: boolean) {
		if (isChecked) {
			this.checkNegeri = true;
			this.negeri = this.semuaNegeri;
		}
		else if (!isChecked) {
			this.checkNegeri = false;
			this.negeri = [];
		}
	}

	pilihNegeri(id, isChecked: boolean, negeri) {
	if (isChecked) {
		this.negeri.push(id);
	} else if (!isChecked) {
		let index = this.negeri.indexOf(id);
		this.negeri.splice(index, 1);

		}

		console.log(this.negeri);
	}

	checkNegeriExist(id?){
		if(this.negeri.indexOf(id)  == -1){
			return false;
		}
		else{
			return true;
		};
	}

	getJumlahBwi(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rowBwi.length;
		this.primengTableHelper.records = this.rowBwi;
		this.primengTableHelper.hideLoadingIndicator();
	}

	addJumlahBwi() {
		const modalRef = this.modalService.open(TambahJumlahBwiComponent, { size: 'md' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
			}
		});
	}

	editJumlahBwi(id) {
		const modalRef = this.modalService.open(TambahJumlahBwiComponent, { size: 'md' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
			}
		});
	}
}
