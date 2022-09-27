import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { catchError, map, of, Subscription, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  private _registerSubs!: Subscription;
  public msgError!: string;

  miFormulario: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this._registerSubs && !this._registerSubs.closed) this._registerSubs.unsubscribe();
  }

  signin() {
    if(this.miFormulario.invalid) {
      return
    }
    const {name, lastName, email, password} = this.miFormulario.value;

    this._registerSubs = this.authService.register(name, lastName, email, password)
    .pipe(
      tap( user => console.log(user)),
      map(({ok}) => ok),
      catchError( err => of(false))
      )
      .subscribe({
        next: (ok) => {
          if (ok) {
            this.router.navigate(['/home/dashboard']);
          } else {
            Swal.fire(
              `${this.msgError}`,
              'Vuelve a intentarlo otra vez',
              'error'
              )
              console.log("No se pudo entrar con el nuevo usuario registrado")
            }
          }
        })

        this.miFormulario.reset();

      }

}
