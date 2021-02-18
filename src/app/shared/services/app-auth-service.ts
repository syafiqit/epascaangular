import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AppAuthService {
	constructor(private _cookieService: CookieService) {}

	logout(reload?: boolean, returnUrl?: string): void {
		this._cookieService.delete('token', '/');
		this._cookieService.delete('role', '/');
		if (reload !== false) {
			if (returnUrl) {
				location.href = returnUrl;
			} else {
				location.href = '';
			}
		}
	}
}
