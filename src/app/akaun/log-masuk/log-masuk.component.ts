import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { finalize } from 'rxjs/operators';
import { AuthServiceProxy, InputLoginDto } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-log-masuk',
	templateUrl: './log-masuk.component.html'
})
export class LogMasukComponent implements OnInit {
	public show = false;
  login: InputLoginDto = new InputLoginDto();
  loading = false;
  saving = false;

	constructor(
    private _cookieService: CookieService,
    private _authServiceProxy: AuthServiceProxy
    ) {}

	ngOnInit(): void {}

	showPassword() {
		this.show = !this.show;
	}

	userlogin() {
    this._authServiceProxy.login(this.login).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe(result => {
      const validity = new Date(new Date().getTime() + (result.expires_in + 28800) * 1000);
					this._cookieService.set('token', result.access_token, validity, '/');
					location.href = '/app/muka-halaman';
    },
    () => {
      Swal.fire('', 'Email/Kata Laluan Anda Salah, Sila Cuba Lagi', 'error');
    }
    );
  }

}
