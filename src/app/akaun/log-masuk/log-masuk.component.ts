import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-log-masuk',
	templateUrl: './log-masuk.component.html'
})
export class LogMasukComponent implements OnInit {
	public show = false;

	email = '';
	password = '';

	constructor(private _cookieService: CookieService, private _router: Router) {}

	ngOnInit(): void {}

	showPassword() {
		this.show = !this.show;
	}

	login() {
		const token = this.randomString();
		const expireInSeconds = 604800;
		const expireDate = new Date(new Date().getTime() + 1000 * expireInSeconds);

		switch (this.email) {
			case 'admininistrator@test.com': {
				this._cookieService.set('token', token, expireDate, '/');
				this._cookieService.set('role', 'admininistrator', expireDate, '/');
				this._router.navigateByUrl('/dashboard');
				break;
			}
			case 'penyelia@test.com': {
				this._cookieService.set('token', token, expireDate, '/');
				this._cookieService.set('role', 'penyelia', expireDate, '/');
				this._router.navigateByUrl('/dashboard');
				break;
			}
			case 'kewangan@test.com': {
				this._cookieService.set('token', token, expireDate, '/');
				this._cookieService.set('role', 'kewangan', expireDate, '/');
				this._router.navigateByUrl('/dashboard');
				break;
			}
			case 'pengguna@test.com': {
				this._cookieService.set('token', token, expireDate, '/');
				this._cookieService.set('role', 'pengguna', expireDate, '/');
				this._router.navigateByUrl('/dashboard');
				break;
			}
			default: {
				this._router.navigateByUrl('/akaun/log-masuk');
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
