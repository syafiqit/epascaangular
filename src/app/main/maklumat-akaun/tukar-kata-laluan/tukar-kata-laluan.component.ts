import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ChangePasswordDto, SessionServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';

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
			this._sessionServiceProxy.changePassword(this.newPassword).subscribe(
				() => {
					swalSuccess.fire('Berjaya!', 'Kata Laluan Berjaya Dikemaskini.', 'success');
				},
				() => {
					swalError.fire('', 'Kata Laluan Lama Tidak Sepadan', 'error');
				}
			);
		} else {
			swalError.fire('', 'Kata Laluan Baru dan Ulang Kata Laluan Tidak Sepadan', 'error');
		}
	}
}
