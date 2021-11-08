import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import {
  CreateOrEditRefBencanaDto,
  InputCreateBencanaDto,
  RefBencanaServiceProxy,
  RefJenisBencanaServiceProxy,
  RefNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from '@app/shared/helpers/PrimengTableHelper';
import { ConfirmationService } from '@services/confirmation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  form: FormGroup;

	negeriArray:any;
	nama_bencana:any;

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

  rows = [];
  idJumlahBwi: number = 0;
  bil: number = 0;
  idBencana: any;
  sorting: any;
  skipCount: any;
  resultCount: any;

  statuses = [
    { id: 0, nama: 'Tidak Aktif' },
    { id: 1, nama: 'Aktif' }
  ];

	constructor(
		config: NgbModalConfig,
		private router: Router,
		private _activatedRoute: ActivatedRoute,
		private _refBencanaServiceProxy: RefBencanaServiceProxy,
		private _refJenisBencanaServiceProxy: RefJenisBencanaServiceProxy,
		private _refNegeriServiceProxy: RefNegeriServiceProxy,
		private calendar: NgbCalendar,
		private _confirmationService: ConfirmationService,
		private fb: FormBuilder
	) {
    	this.idBencana = this._activatedRoute.snapshot.queryParams['id'];
		this.primengTableHelper = new PrimengTableHelper();

		this.form = this.fb.group({
		  checkArray: this.fb.array([], [Validators.required])
		})
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

  toModelYear(date: NgbDateStruct | null): number | null {
    return date.year;
  }
	show() {
		if (!this.idBencana) {
			this.pengurusan_bencana = new InputCreateBencanaDto();
			this.bencana = new CreateOrEditRefBencanaDto();

			this.negeri = [];
		} else {
			this._refBencanaServiceProxy.getRefBencanaForEdit(this.idBencana).subscribe((result) => {
				this.bencana = result.ref_bencana;
				this.negeri = result.bencanaNegeri;
        this.idBencana = result.ref_bencana.id;
				this.nama_bencana = this.bencana.nama_bencana;
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
	}

	checkNegeriExist(id?){
		if(this.negeri.indexOf(id)  == -1){
			return false;
		}
		else{
			return true;
		};
	}



	namaBencana(nama_bencana?){
		this.nama_bencana = nama_bencana;
	}

	save(): void {
		this.saving = true;

		if(this.model){
		this.dateDisaster = this.toModel(this.model);
		this.bencana.tarikh_bencana = moment(this.dateDisaster, "YYYY-MM-DD");
		this.bencana.tahun_bencana = this.toModelYear(this.model);
		this.pengurusan_bencana.id_negeri = this.negeri;
		this.pengurusan_bencana.bencana = this.bencana;
		this.pengurusan_bencana.bencana.nama_bencana = this.nama_bencana;

		this._refBencanaServiceProxy
			.createOrEdit(this.pengurusan_bencana)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe(() => {
				if(!this.idBencana){
					this.confirmMessage();
				}
				else{
					this.updateMessage();
				}
			},(error) =>{
				const dialogRef = this._confirmationService.open({
					title: 'Tidak Berjaya!',
					message: 'Ruangan Negeri Wajib Diisi.',
					icon: {
						show: true,
						name: 'x-circle',
						color: 'error'
					  },
					  actions: {
						confirm: {
						  show: true,
						  label: 'Tutup',
						  color: 'primary'
						},
						cancel: {
						  show: false
						}
					  },
					  dismissible: true
				  });
			});
    	}
	}

	confirmMessage(){
		const dialogRef = this._confirmationService.open({
		  title: 'Berjaya',
		  message: 'Maklumat Bencana Berjaya Disimpan.',
		  icon: {
			show: true,
			name: 'check-circle',
			color: 'success'
		  },
		  actions: {
			confirm: {
			  show: true,
			  label: 'Tutup',
			  color: 'primary'
			},
			cancel: {
			  show: false
			}
		  },
		  dismissible: true
		});
		dialogRef.afterClosed().subscribe(() => {
		  this.router.navigate(['/app/bencana/senarai']);
		});
	}

	updateMessage(){
		const dialogRef = this._confirmationService.open({
		  title: 'Berjaya',
		  message: 'Maklumat Bencana Berjaya Dikemaskini.',
		  icon: {
			show: true,
			name: 'check-circle',
			color: 'success'
		  },
		  actions: {
			confirm: {
			  show: true,
			  label: 'Tutup',
			  color: 'primary'
			},
			cancel: {
			  show: false
			}
		  },
		  dismissible: true
		});
		dialogRef.afterClosed().subscribe(() => {
		  this.router.navigate(['/app/bencana/senarai']);
		});
	}
}
