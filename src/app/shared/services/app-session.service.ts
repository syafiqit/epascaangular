import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AppSessionService {
	private _token: string;
	private _role: string;

	constructor(private _cookieService: CookieService) {}

	get token(): string {
		return this._token;
	}

	get role(): string {
		return this._role;
	}

	/* todo: modify to server sided */
	init(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			setTimeout(() => {
				this._token = this._cookieService.get('token') ?? null;
				this._role = this._cookieService.get('role') ?? null;
				if (this._token) {
					resolve(this._token);
				} else {
					reject('error');
				}
			}, 1500);
		});
	}
}
