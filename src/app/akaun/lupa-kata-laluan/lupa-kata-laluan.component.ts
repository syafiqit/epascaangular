import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthServiceProxy, InputForgotPasswordDto } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

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
					Swal.fire(
						'Berjaya',
						'Kami Telah Menghantar Pautan Tetapan Semula Kata Laluan Anda Melalui Email',
						'success'
					).then(() => {
						this.router.navigateByUrl('/akaun/log-masuk');
					});
				},
				() => {
					Swal.fire('', 'Tiada Pengguna Dijumpai. Sila Semak Semula Email', 'error');
				}
			);
	}
}
