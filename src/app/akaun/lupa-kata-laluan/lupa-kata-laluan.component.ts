import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthServiceProxy, InputForgotPasswordDto } from 'src/app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
	selector: 'app-lupa-kata-laluan',
	templateUrl: './lupa-kata-laluan.component.html',
	styles: []
})
export class LupaKataLaluanComponent implements OnInit {

  public show = false;
	saving = false;
  loading = false;
  password: InputForgotPasswordDto = new InputForgotPasswordDto();

	constructor(
    private _confirmationService: ConfirmationService,
    private _authServiceProxy: AuthServiceProxy,
    private router: Router
  ) {}

	ngOnInit(): void {}

  save() {
    this.loading = true;
		this._authServiceProxy
			.forgotPassword(this.password)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
      .pipe(finalize(()=>{
        this.loading = false;
      }))
			.subscribe(
				() => {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Kami Telah Menghantar Pautan Tetapan Semula Kata Laluan Anda Melalui Email',
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
            this.router.navigateByUrl('/akaun/log-masuk');
          });
				},
				() => {
          this._confirmationService.open({
            title: 'Tidak Berjaya',
            message: 'Tiada Pengguna Dijumpai. Sila Semak Semula Email',
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
				}
			);
	}
}
