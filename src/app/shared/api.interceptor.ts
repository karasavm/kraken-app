import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor (private router: Router,
               private inj: Injector) {


    }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {



    // const auth = this.inj.get(AuthService);
    // const authToken = auth.getAuthorizationToken();

    console.log('REQUEST         =>', req);
    const started = Date.now();
    return next.handle(req)
      .do(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          // console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
          console.log(`RESPONSE(${elapsed}ms) =>`, event);
        }
      })
      .catch((error: HttpErrorResponse) => {


        if (error instanceof HttpErrorResponse) {
          const elapsed = Date.now() - started;

          console.error(`RESPONSE ERROR(${elapsed}ms) =.`, error);

          if (error.status === 401) {
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
