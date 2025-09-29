import { Router } from '@angular/router';

import {
    BehaviorSubject,
    Observable,
    throwError as observableThrowError,
} from 'rxjs';

import {
    HttpErrorResponse,
    HttpHandler,
    HttpHeaderResponse,
    HttpInterceptor,
    HttpProgressEvent,
    HttpRequest,
    HttpResponse,
    HttpSentEvent,
    HttpUserEvent,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { ApiService } from './api.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    isRefreshingToken = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('null');

    constructor(
        private injector: Injector,
        public router: Router,
        private snackBar: ApiService
    ) { }

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {

        const headers: any = {};

        headers['Authorization'] = token;

        return req.clone({ setHeaders: headers });
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<
        | HttpSentEvent
        | HttpHeaderResponse
        | HttpProgressEvent
        | HttpResponse<any>
        | HttpUserEvent<any>
    > {

        let authToken: any = localStorage.getItem('authToken') || '';

        if (!authToken) {
            authToken = localStorage.getItem('otpToken') || ''
        }

        return next.handle(this.addToken(req, authToken)).pipe(
            finalize(() => { }),
            catchError((error, event) => {
                this.snackBar.alerts(error.error.message);
                if (error instanceof HttpErrorResponse) {
                    switch ((error as HttpErrorResponse).status) {
                        case 400:
                            return this.handle400Error(error);
                        case 401:
                            return this.handle401Error(req, next);
                        case 403:
                            return this.handle401Error(req, next);
                        default:
                            return observableThrowError(error);
                    }
                } else {
                    return observableThrowError(error);
                }
            })
        );
    }

    handle400Error(error: any) {
        if (
            error &&
            error.status === 400 &&
            error.error &&
            error.error.error === 'invalid_grant'
        ) {
            // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
            return this.logoutUser();
        }

        return observableThrowError(error);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        this.isRefreshingToken = true;

        // Reset here so that the following requests wait until the token
        // comes back from the refreshToken call.
        this.tokenSubject.next('null');

        return this.logoutUser();
    }

    logoutUser() {
        localStorage.clear();
        this.router.navigate(['/home'])
        return observableThrowError('');
    }
}
