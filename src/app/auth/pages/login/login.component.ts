import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { map, catchError, of } from "rxjs";

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group( {
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")] ],
    password: ['', [Validators.required, Validators.minLength(6)] ]
  })

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    if(this.miFormulario.invalid){
      return
    }
    const {email, password} = this.miFormulario.value;

    this.miFormulario.reset();

    this.authService.login(email, password)
        .pipe(
          map( ({ok}) => ok),
          catchError( err => of(false))
        )
        .subscribe({
          next: (ok) => {
            if( ok ) {
              this.router.navigate(['/home/dashboard'])
            } else {
              console.log("No se pudo entrar")
            }
          }
        });
  }

}
