import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {LoaderService} from "./services/loader.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor (private router: Router,
               private inj: Injector,
               private spinnerService: LoaderService
  ) {


    }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {



    // const auth = this.inj.get(AuthService);
    // const authToken = auth.getAuthorizationToken();

    console.log('REQUEST         =>', req);
    const started = Date.now();

    this.spinnerService.showSpinner();
    return next.handle(req)
      .do(event => {
        // this.spinnerService.hideSpinner();
        if (event instanceof HttpResponse) {
          this.spinnerService.hideSpinner();
          const elapsed = Date.now() - started;
          // console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
          console.log(`RESPONSE(${elapsed}ms) =>`, event);
        }
      })
      .catch((error: HttpErrorResponse) => {
        this.spinnerService.hideSpinner();

        if (error instanceof HttpErrorResponse) {
          const elapsed = Date.now() - started;
          console.error(`RESPONSE ERROR(${elapsed}ms) =.`, error);

          if (error.status === 401) {
            console.log("Unauthorized, force logout!")
            const authService = this.inj.get(AuthService);
            authService.logout();

          }
        } else {

          const err = (error as Error);
          const errMsg = err.message ? err.message : err.toString();
          console.error('UKNOWN ERROR INSIDE "httpINTERCEPTOR": ', errMsg);
        }


        // TODO: send the error to remote logging infrastructure
        // console.error("ERROR HANDLER", error); // log to console instead
        // TODO: better job of transforming error for user consumption
        // this.log(`${operation} failed: ${error.message}`);


        return Observable.throw(error);
      });
  }
}
//
//   ////// :todo use the above check
//   // if (err.error instanceof Error) {
//   //   console.log('Client-side error occured.');
//   // } else {
//   //   console.log('Server-side error occured.');
//   // }
//
//   this.msgService.error('ERROR')
//   // TODO: send the error to remote logging infrastructure
//   console.error("ERROR HANDLER", error); // log to console instead
//   // TODO: better job of transforming error for user consumption
//   // this.log(`${operation} failed: ${error.message}`);
//
//   // Let the app keep running by returning an empty result.
//   return of(result as T);
// };
