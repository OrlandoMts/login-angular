import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      // retorna true o false
    return this.authService.validateToken()
            .pipe(
              tap( valid => {
                if (!valid) {
                  this.router.navigate(['/auth'])
                }
              })
             )

  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | boolean {
    return this.authService.validateToken()
            .pipe(
              tap( valid => {
                if (!valid) {
                  this.router.navigate(['/auth'])
                }
              })
            )
  }
}
