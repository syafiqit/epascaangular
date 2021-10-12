import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { swalError, swalSuccess } from '@app/shared/sweet-alert/swal-constant';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordDto, OutputProfilDto, SessionServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-tukar-kata-laluan',
	templateUrl: './tukar-kata-laluan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TukarKataLaluanComponent implements OnInit {

	public validate = false;
	public tooltipValidation = false;
	public show = false;
	public showNew = false;
	public showRepeatNew = false;

  newPassword: ChangePasswordDto = new ChangePasswordDto();
  output: OutputProfilDto = new OutputProfilDto();
  passwordPattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"

	constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _sessionServiceProxy: SessionServiceProxy
  ) {}

	ngOnInit(): void {}

	open() {
		this.modalService.open(TukarKataLaluanComponent, {
			size: 'lg'
		});
	}

  showPassword() {
		this.show = !this.show;
	}

	showNewPassword() {
		this.showNew = !this.showNew;
	}

	showRepeatNewPassword() {
		this.showRepeatNew = !this.showRepeatNew;
	}

	save() {
		this.validate = !this.validate;

		if (this.newPassword.kata_laluan_baru === this.newPassword.ulang_kata_laluan_baru) {
			this._sessionServiceProxy
      .changePassword(this.newPassword)
      .subscribe((result) => {
        this.output = result;
        if(this.output.message == "Kata laluan berjaya ditukar") {
          swalSuccess.fire('Berjaya!', 'Kata Laluan Berjaya Dikemaskini.', 'success')
          this.activeModal.close(true);
        }
        else {
          swalError.fire('Tidak Berjaya!', this.output.message, 'error');
        }
			});
		}
    else {
      swalError.fire('Tidak Berjaya!', 'Kata Laluan Baru dan Ulang Kata Laluan Tidak Sepadan', 'error');
		}
	}
}
