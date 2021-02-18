import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppSessionService } from 'src/app/shared/services/app-session.service';

@Injectable()
export class AccountRouteGuard implements CanActivate {
	constructor(private _router: Router, private _sessionService: AppSessionService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		if (route.queryParams['ss'] && route.queryParams['ss'] === 'true') {
			return of(true);
		}

		if (this._sessionService.token) {
			this._router.navigate([this.selectBestRoute()]);
			return of(false);
		}

		return of(true);
	}

	selectBestRoute(): string {
		if (this._sessionService.role === 'nadma') {
			return '/dashboard';
		}

		if (this._sessionService.role === 'ngo') {
			return '/dashboard';
		}

		return '/dashboard';
	}
}
