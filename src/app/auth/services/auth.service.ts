import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from '../interfaces/auth.interface';
import { catchError, of, tap, Observable } from 'rxjs';

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
        if (user.ok) {
          this._user = {
            uid: user.uid!,
            name: user.name!
          }
        }
      }),
      catchError(err => of(err.error))
    );

  }


}
