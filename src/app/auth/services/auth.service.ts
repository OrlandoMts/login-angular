import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from '../interfaces/auth.interface';
import { catchError, of, tap, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _APIURL: string = environment.api_backend;
  private _user!: User;

  constructor(private http: HttpClient) { }

  get user() {
    return { ...this._user }
  }

  login( email: string, password: string): Observable<AuthResponse> {
    const url = `${this._APIURL}/auth`;
    const body = { email, password }

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((user) => {
        console.log(user);
        if (user.ok) {
          localStorage.setItem('token-app', user.token!)
          this._user = {
            uid: user.user?.uid!,
            name: user.user?.name!,
            // lastName: user.lastName,
            // email: user.email
            // lastName: user
            // agregar mas propiedades
          }
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
            uid: user.user?.uid!,
            name: user.user?.name!,
          }
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
                            uid: resp.uid!,
                            name: resp.user?.name!,

                          }
                      }),
                      map( resp => {
                        return resp.ok
                      }),
                      catchError( err => of(false))
                    )
  };

  infoUser(): Observable<AuthResponse> {
    const url = `${this._APIURL}/auth/get-user`;
    const headers = new HttpHeaders()
      .set('Authorization', localStorage.getItem('token-app') || '');

    return this.http.get<AuthResponse>(url, {headers}).pipe(
      tap( (data) => {
        const {user} = data;
        this._user = {
          uid: user?.uid!,
          name: user?.name!,
          lastName: user?.lastName!,
          email: user?.email!,
          address: user?.address!,
          city: user?.city!,
          country: user?.country!,
          postalCode: user?.postalCode!,
          about: user?.about!,
        }
      }),
      map( ({user}) => user ),
      catchError(err => of(err))
    );

  }

  logout() {
    localStorage.removeItem('token-app');
  }


}
