import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-log-masuk',
	templateUrl: './log-masuk.component.html'
})
export class LogMasukComponent implements OnInit {
	public show = false;

	nokp = '';
	password = '';

	constructor(private _cookieService: CookieService) {}

	ngOnInit(): void {}

	showPassword() {
		this.show = !this.show;
	}

	login() {
		const token = this.randomString();
		const expireInSeconds = 604800;
		const expireDate = new Date(new Date().getTime() + 1000 * expireInSeconds);

		switch (this.nokp) {
			case '750504030201': {
				this._cookieService.set('token', token, expireDate, '/');
				this._cookieService.set('role', 'administrator', expireDate, '/');
				location.href = '/app/muka-halaman';
				break;
			}
			case '750504030202': {
				this._cookieService.set('token', token, expireDate, '/');
				this._cookieService.set('role', 'penyelia', expireDate, '/');
				location.href = '/app/muka-halaman';
				break;
			}
			case '750504030203': {
				this._cookieService.set('token', token, expireDate, '/');
				this._cookieService.set('role', 'kewangan', expireDate, '/');
				location.href = '/app/muka-halaman';
				break;
			}
			case '750504030204': {
				this._cookieService.set('token', token, expireDate, '/');
				this._cookieService.set('role', 'pengguna', expireDate, '/');
				location.href = '/app/muka-halaman';
				break;
			}
			default: {
				location.href = '/akaun/log-masuk';
				break;
			}
		}
	}

	randomString() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 20; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}
}
