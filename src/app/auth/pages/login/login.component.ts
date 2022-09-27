import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { map, catchError, of, tap, Subscription } from "rxjs";
// import Swal from 'sweetalert2';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  private _loginSub!: Subscription;
  public msgError!: string;

  miFormulario: FormGroup = this.fb.group( {
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")] ],
    password: ['', [Validators.required, Validators.minLength(6)] ]
  })

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this._loginSub && !this._loginSub.closed) this._loginSub.unsubscribe();
  }

  login() {

    if(this.miFormulario.invalid){
      return
    }
    const {email, password} = this.miFormulario.value;

    this.miFormulario.reset();

    this._loginSub = this.authService.login(email, password)
        .pipe(
          tap( (data)=> this.msgError = data.msg!), // Mensaje de error de la respuesta
          map( ({ok}) => ok),
          catchError( err => of(false))
        )
        .subscribe({
          next: (ok) => {
            if( ok ) {
              this.router.navigate(['/home/dashboard'])
            } else {
              Swal.fire(
                `${this.msgError}`,
                '¿Ya tienes una cuenta?, da click en "Crear una aquí"',
                'question'
              )
              console.log("No se pudo entrar")
            }
          }
        });
  }

}
