import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  CreateOrEditTabungBwiDto,
  GetRujukanKelulusanBwiDto,
  GetTabungBwiForEditDto,
  InputCreateTabungBwiDto,
  RefBencanaServiceProxy,
  RefJenisBwiServiceProxy,
  TabungBwiServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-edit-wang-ihsan',
	templateUrl: './edit-wang-ihsan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal]
})
export class EditWangIhsanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('f') public f: NgForm;

	primengTableHelper: PrimengTableHelper;

  edit: GetTabungBwiForEditDto = new GetTabungBwiForEditDto();
  tabungBwi: InputCreateTabungBwiDto = new InputCreateTabungBwiDto();
  bwi: CreateOrEditTabungBwiDto = new CreateOrEditTabungBwiDto();
  kelulusan: GetRujukanKelulusanBwiDto = new GetRujukanKelulusanBwiDto();

  active;
  nama_pembayaran:string;
  idBwi: any;
  filter: string;
  filterJenisBwi: string;
  no_rujukan_kelulusan: string;
  nama_jenis_bencana: string;
  rujukan_surat: string;
  nama_tabung: string;
  perihal_surat: string;
  rows = [];
  bwiType: any;
  bayaran: number = 0;
  jenisBwi: any;
  id_bencana: any;
  bencana: any;
  nama_bencana: string;
  tarikh_bencana: any;
  idJenisBwi: number;

  saving = false;
  tarikhBencana: string;
  tarikhKejadian: string;

  date = new Date();
  modelBencana: NgbDateStruct;
  modelKejadian: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

	constructor(
    private router: Router,
    config: NgbModalConfig,
    private calendar: NgbCalendar,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungBwiServiceProxy: TabungBwiServiceProxy,
    private _refJenisBwiServiceProxy: RefJenisBwiServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy
  ) {
    this.idBwi = this._activatedRoute.snapshot.queryParams['id'];
    this.id_bencana = this._activatedRoute.snapshot.queryParams['idBencana'];
		this.primengTableHelper = new PrimengTableHelper();
    this.edit.tabung_bwi = new CreateOrEditTabungBwiDto();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getTabungBwi();
    this.getJenisBwi();
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

  getTabungBwi() {
    this._tabungBwiServiceProxy.getTabungBwiForEdit(this.idBwi).subscribe((result)=>{
      this.edit = result;
      this.edit.tabung_bwi = result.tabung_bwi;
      this.tarikh_bencana = this.edit.tabung_bwi.tarikh_bencana.format('YYYY-MM-DD');
      this.idJenisBwi = this.edit.tabung_bwi.id_jenis_bwi;
    })
  }

  getJenisBwi(){
    this._refJenisBwiServiceProxy.getRefJenisBwiForDropdown(this.filterJenisBwi).subscribe((result) => {
			this.jenisBwi = result.items;
		});
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  validate(changeEvent: NgbNavChangeEvent){
    if(this.f.invalid){
      for (var i in this.f.controls) {
        this.f.controls[i].markAllAsTouched();
        this.f.controls[i].markAsTouched();
      }
      changeEvent.preventDefault();
    }
  }

	save() {
    this.saving = true;
    this.tabungBwi.bwi = this.edit.tabung_bwi;
    this._tabungBwiServiceProxy
			.createOrEdit(this.tabungBwi)
			.pipe()
			.subscribe((result) => {
				swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Wang Ihsan Berjaya Disimpan.', 'success').then(() => {
          this.router.navigateByUrl('/app/tabung/senarai-wang-ihsan');
				});
			});
	}
}
