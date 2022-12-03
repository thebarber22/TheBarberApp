import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { from, Observable } from "rxjs";
import { AuthService } from "./auth.service";
import {switchMap, tap} from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { Storage } from "@ionic/storage";

const TOKEN_HEADER_KEY = 'Authorization';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	companyId = environment.companyId;
	userId : any = "";
	constructor(
        private token: AuthService, 
        private router: Router,
		private storage:Storage) {
			this.init()
	}

	async init(){
		//await this.storage.create().then()
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let authReq = req;
		const loginPath = '/login';
		return from(this.storage.get(TOKEN_KEY))
        .pipe(switchMap(token => {
			console.log(token)
			if (token != null) {
				authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token).set("companyId", this.companyId)});
			} else {
				authReq = req.clone({ headers: req.headers.set("companyId", this.companyId)});
			}
			return next.handle(authReq).pipe( tap(() => {},
			(err: any) => {
				if (err instanceof HttpErrorResponse) {
					if (err.status !== 401 || window.location.pathname === loginPath) {
						return;
					}
					this.token.signOut();
					window.location.href = loginPath;
				}
			}
			));
		}))
	}
}

export const authInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];


