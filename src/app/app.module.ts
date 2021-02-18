import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
// for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CookieService } from 'ngx-cookie-service';
import { AppSessionService } from './shared/services/app-session.service';
import { AppRouteGuard } from './shared/guards/app-route-guard';

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function appInitializerFactory(injector: Injector) {
	return (): Promise<boolean> => {
		return new Promise<boolean>((resolve, reject) => {
			const appSessionService: AppSessionService = injector.get(AppSessionService);
			const cookieService: CookieService = injector.get(CookieService);
			if (cookieService.get('token')) {
				appSessionService.init().then(
					(result) => {
						console.log(result);
						if (result) {
							resolve(true);
						}
					},
					(err) => {
						reject(err);
					}
				);
			} else {
				resolve(true);
			}
		});
	};
}

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		SharedModule,
		AppRoutingModule,
		HttpClientModule,
		NgbModule,
		ToastrModule.forRoot(),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		TableModule,
		PaginatorModule,
		// for HttpClient use:
		LoadingBarHttpClientModule,
		// for Router use:
		LoadingBarRouterModule,
		// for Core use:
		LoadingBarModule
	],
	providers: [
		AppSessionService,
		CookieService,
		AppRouteGuard,
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializerFactory,
			deps: [Injector],
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
