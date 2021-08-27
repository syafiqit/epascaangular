import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceProxy, InputResetPasswordDto } from 'src/app/shared/proxy/service-proxies';
import { swalError, swalSuccess } from '@shared/sweet-alert/swal-constant';

@Component({
  selector: 'app-reset-kata-laluan',
  templateUrl: './reset-kata-laluan.component.html',
  styles: []
})
export class ResetKataLaluanComponent implements OnInit {
  public show = false;
	public showNew = false;
	allowChangePassword = false;
	showMessage = false;
	userEmail: string;
	accessCode: string;
	error = '';

  resetPassword: InputResetPasswordDto = new InputResetPasswordDto();

  constructor(
    private _authServiceProxy: AuthServiceProxy,
    private _activatedRoute: ActivatedRoute
  ) {
    this._activatedRoute.queryParams.subscribe((p) => {
			this.userEmail = p['emel'];
			this.accessCode = p['kod_akses'];
			this.verifyCode(p['emel'], p['kod_akses']);
		});
   }

  ngOnInit(): void {
  }

  verifyCode(emel, kod_akses) {
		this._authServiceProxy.verifyCode(emel, kod_akses).subscribe(
			(e) => {
				this.allowChangePassword = true;
			},
			(err) => {
				this.showMessage = true;
				this.error = 'Kod Akses Anda Tidak Sah Dan Telah Tamat Tempoh. Sila Minta Kod Akses Yang Baru';
			}
		);
	}

  showPassword() {
		this.show = !this.show;
	}

	showNewPassword() {
		this.showNew = !this.showNew;
	}

  save() {
		this.resetPassword.emel = this.userEmail;
		this.resetPassword.kod_akses = this.accessCode;

		if (this.resetPassword.kata_laluan === this.resetPassword.ulang_kata_laluan) {
			this._authServiceProxy.resetPassword(this.resetPassword).subscribe(
				() => {
					swalSuccess.fire(
						'',
						'Kata Laluan Telah Ditetapkan Semula. Sila Log Masuk Dengan Kata Laluan Baru Anda',
						'success'
					).then(() => {
						location.href = '/akaun/log-masuk';
					});
				},
				() => {
					swalError.fire(
						'',
						'Kod Akses Tidak Sah & Telah Tamat Tampoh. Sila Minta Kod Akses Yang Baharu ',
						'error'
					);
				}
			);
		} else {
			swalError.fire('', 'Kata Laluan Dan Ulang Kata Laluan Tidak Sama ', 'error');
		}
	}

}
