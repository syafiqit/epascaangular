import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad,
	Router,
	RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { AppSessionService } from '../services/app-session.service';

@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild {
	constructor(private _router: Router, private _sessionService: AppSessionService) {}

	canActivateInternal(data: any, state: RouterStateSnapshot): Observable<boolean> {
		if (!this._sessionService.pengguna) {
			this._router.navigate(['/akaun/log-masuk']);
			return of(false);
		}

		if (!data || !data['permission']) {
			return of(true);
		}

    if (this._sessionService.isGranted(data['permission'])) {
      return of(true);
    }

		this._router.navigate([this.selectBestRoute()]);
		return of(false);
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.canActivateInternal(route.data, state);
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.canActivate(route, state);
	}

	selectBestRoute(): string {
		if (!this._sessionService.pengguna) {
			return '/akaun/log-masuk';
		}

		if (this._sessionService.pengguna) {
			return '/app/muka-halaman';
		}

		return '/404';
	}
}
