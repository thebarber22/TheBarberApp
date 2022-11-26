import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import {tap} from 'rxjs/operators';
import { environment } from "src/environments/environment";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	companyId = environment.companyId;
	userId : any = "";
	constructor(
        private token: AuthService, 
        private router: Router) {

	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.userId = this.token.getUser();
		let authReq = req;
		const loginPath = '/login';
		const token = this.token.getToken();
		if (token != null) {
			authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token).set("companyId", this.companyId).set("userId", this.userId.id)});
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
	}
}

export const authInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];


