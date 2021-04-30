// Angular
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
declare let require;
const Swal = require('sweetalert2');
/**
 * More information there => https://medium.com/@MetonymyQT/angular-http-interceptors-what-are-they-and-how-to-use-them-52e060321088
 */
@Injectable()
export class InterceptorService implements HttpInterceptor {
	constructor(private _cookieService: CookieService) {}

	// intercept request and add token
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// tslint:disable-next-line:no-debugger
		// modify request
		request = request.clone({
			setHeaders: {
				Authorization: `Bearer ${this._cookieService.get('token')}`
			}
		});
		// console.log('----request----');
		// console.log(request);
		// console.log('--- end of request---');

		return next.handle(request).pipe(
			tap(
				(event) => {
					if (event instanceof HttpResponse) {
						// console.log('all looks good');
						// http response status code
						// console.log(event.status);
					}
				},
				(error) => {
					// http response status code
					// console.log('----response----');
					// console.error('status code:');
					// tslint:disable-next-line:no-debugger
          if (error instanceof HttpErrorResponse && error.error instanceof Blob && error.error.type === "application/json") {
            // https://github.com/angular/angular/issues/19888
            // When request of type Blob, the error is also in Blob instead of object of the json data
            return new Promise<any>((resolve, reject) => {
                let reader = new FileReader();
                reader.onload = (e: Event) => {
                    try {
                      const errmsg = JSON.parse((<any>e.target).result);
                      reject(new HttpErrorResponse({
                          error: errmsg,
                          headers: error.headers,
                          status: error.status,
                          statusText: error.statusText,
                          url: error.url
                      }));
                        // const errmsg = JSON.parse((<any>e.target).result);
                        // const str = ((JSON.stringify(errmsg).replace(/["{},\[\]]/g, "")).replace(/[:]/g, ": ")).replace(/[.]/g, ". <br>");
                        // Swal.fire(error?.statusText, str, 'error');
                    } catch (e) {
                        reject(error);
                    }
                };
                reader.onerror = (e) => {
                    reject(error);
                };
                reader.readAsText(error.error);
            });
          }
					console.error(error.status);
					console.error(error.message);
					// console.log('--- end of response---');
				}
			)
		);
	}
}
