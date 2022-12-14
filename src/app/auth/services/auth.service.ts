import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from '../interfaces/auth.interface';
import { catchError, of, tap, Observable, map, BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _APIURL: string = environment.api_backend;
  private _user!: User;

  // Paso 1. Crear el Subject
  // Paso 2. Hacer las emisiones
  // Paso 3. Suscribirme a las emisiones
  private _userSub$ = new BehaviorSubject<User | undefined>(this._user);
  public userObs$ = this._userSub$.asObservable();

  constructor(private http: HttpClient) { }

  // get user() {
  //   return { ...this._user }
  // }

  login( email: string, password: string): Observable<AuthResponse> {
    const url = `${this._APIURL}/auth`;
    const body = { email, password }

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((user) => {
        // console.log(user);
        if (user.ok) {
          localStorage.setItem('token-app', user.token!)
          this._user = {
            _id: user.user?._id!,
            name: user.user?.name!
          }
          this._userSub$.next(this._user); // Paso 2
        }
      }),
      catchError(err => of(err.error))
    );

  }

  register(name: string, lastName: string, email: string, password: string): Observable<AuthResponse> {
    const url = `${this._APIURL}/auth/new`;
    const body = { name, lastName, email, password };

    return this.http.post<AuthResponse>(url,body).pipe(
      tap( (user) => {
        if(user.ok) {
          localStorage.setItem('token-app', user.token!)
          this._user = {
            _id: user.user?._id!,
            name: user.user?.name!,
          }
          this._userSub$.next(this._user); // Paso 2
        }
      }),
      catchError(err => of(err.error))
    )

  }

  /** De cierto pasa cuando el navegador
   * se refresca. Es ahi donde entra el Guard y vuelve a
   * "llenar" el objeto this._user
   */
  validateToken(): Observable<boolean> {
    const url = `${this._APIURL}/auth/renew`;
    const headers = new HttpHeaders()
      .set('Authorization', localStorage.getItem('token-app') || '');

    return this.http.get<AuthResponse>(url, {headers})
                    .pipe(
                      tap( resp => {
                        localStorage.setItem('token-app', resp.token!)
                          this._user = {
                            _id: resp.uid!,
                            name: resp.user?.name!,

                          }
                          this._userSub$.next(this._user); // Paso 2
                      }),
                      map( resp => {
                        return resp.ok
                      }),
                      catchError( err => of(false))
                    )
  };

  infoUser(): void {
    const url = `${this._APIURL}/auth/get-user`;
    const headers = new HttpHeaders()
      .set('Authorization', localStorage.getItem('token-app') || '');
    let subs = this.http.get<AuthResponse>(url, { headers}).pipe(
      catchError((err) => of(err))
    ).subscribe((res: AuthResponse) => {
      if(res.ok){
        this._userSub$.next(res?.user);
        subs.unsubscribe();
      }
    });
  }

  updateUser(name: string, lastName: string,
            address: string, city: string,
            country: string, postalCode: number,
            about: string): void {
    const url = `${this._APIURL}/auth/update-account`;
    const headers = new HttpHeaders()
      .set('Authorization', localStorage.getItem('token-app') || '');
    const body = {name, lastName, address, city, country, postalCode, about};
    let subs = this.http.put<AuthResponse>(url, body, {headers}).pipe(
      catchError((err) => of(err))
    ).subscribe((res: AuthResponse) => {
      if(res.ok) {
        this._userSub$.next(res?.user);
        this.infoUser();
        subs.unsubscribe();
      }
    });
  }

  logout() {
    localStorage.removeItem('token-app');
  }

  setUser(user: any): void {
    console.log("usario enviado desde el componente ", user);
    // this._userSub$.next(user);
  }


}
