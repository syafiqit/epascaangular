import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  CreateOrEditTabungBwiDto,
  CreateOrEditTabungBwiKawasanDto,
  GetRujukanKelulusanBwiDto,
  GetTabungBwiForEditDto,
  InputCreateBwiTabungBayaranDto,
  InputCreateBwiTabungKawasanDto,
  InputCreateTabungBwiDto,
  RefJenisBwiServiceProxy,
  TabungBwiBayaranServiceProxy,
  TabungBwiKawasanServiceProxy,
  TabungBwiServiceProxy,
  UpdateBwiBayaranDto
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
  bwi_bayaran: UpdateBwiBayaranDto[] = [];
  bantuanKawasan: CreateOrEditTabungBwiKawasanDto[] = [];
  bayaran: InputCreateBwiTabungBayaranDto = new InputCreateBwiTabungBayaranDto();
  kawasan: InputCreateBwiTabungKawasanDto = new InputCreateBwiTabungKawasanDto();

  items = [];
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
  jenisBwi: any;
  id_bencana: any;
  bencana: any;
  nama_bencana: string;
  tarikh_bencana: any;
  idJenisBwi: number;
  id_daerah: number;
  id_negeri: number;
  jumlah_diberi: number;

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
    private _tabungBwiBayaranServiceProxy: TabungBwiBayaranServiceProxy,
    private _tabungBwiKawasanServiceProxy: TabungBwiKawasanServiceProxy
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

  getIdBayaranTerus(id_bayaran_terus: number) {
    const bayaranBwi = new UpdateBwiBayaranDto();
    bayaranBwi.id_tabung_bayaran_terus = id_bayaran_terus;
    this.bwi_bayaran.push(bayaranBwi);
  }

  getIdDaerah(id_daerah: number) {
    // const bantuanKawasanBwi = new CreateOrEditTabungBwiKawasanDto();
    // bantuanKawasanBwi.id_daerah = id_daerah;
    // this.bantuanKawasan.push(bantuanKawasanBwi);
    this.id_daerah = id_daerah;
  }

  getIdNegeri(id_negeri: number) {
    // const bantuanKawasanBwi = new CreateOrEditTabungBwiKawasanDto();
    // bantuanKawasanBwi.id_negeri = id_negeri;
    // this.bantuanKawasan.push(bantuanKawasanBwi);
    this.id_negeri = id_negeri;
  }

  getJumlahDiberi(jumlah_diberi: number) {
    // const bantuanKawasanBwi = new CreateOrEditTabungBwiKawasanDto();
    // bantuanKawasanBwi.jumlah_bwi = jumlah_diberi;
    // this.bantuanKawasan.push(bantuanKawasanBwi);
    this.jumlah_diberi = jumlah_diberi;
  }

	save() {
    this.saving = true;
    const bantuanKawasanBwi = new CreateOrEditTabungBwiKawasanDto();
    bantuanKawasanBwi.id_daerah = this.id_daerah;
    bantuanKawasanBwi.id_negeri = this.id_negeri;
    bantuanKawasanBwi.jumlah_bwi = this.jumlah_diberi;
    this.bantuanKawasan.push(bantuanKawasanBwi);

    this.tabungBwi.bwi = this.edit.tabung_bwi;
    this.bayaran.bwi_bayaran = this.bwi_bayaran;
    this.kawasan.bwi_kawasan = this.bantuanKawasan;
    this.bayaran.id_tabung_bwi = this.idBwi;
    this.kawasan.id_tabung_bwi = this.idBwi;

    if(this.bwi_bayaran){
      this._tabungBwiBayaranServiceProxy
			.createOrEdit(this.bayaran).pipe().subscribe();
    }

    if(this.bantuanKawasan){
      this._tabungBwiKawasanServiceProxy
			.createOrEdit(this.kawasan).pipe().subscribe();
    }

    this._tabungBwiServiceProxy
			.createOrEdit(this.tabungBwi)
			.pipe()
			.subscribe((result) => {
				swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Wang Ihsan Berjaya Dikemaskini.', 'success').then(() => {
          this.router.navigateByUrl('/app/tabung/senarai-wang-ihsan');
				});
			});
	}
}
