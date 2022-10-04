import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, Observer, of, Subscription, tap } from 'rxjs';
import { User } from 'src/app/auth/interfaces/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  public user!: User;
  private _userSubs!: Subscription; //BehaviorSubject
  private _userInfoSubs!: Subscription;

  public miFormulario: FormGroup = this.fb.group({
    email: [{value: '', disabled: true}],
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    address: [''],
    city: [''],
    country: [''],
    postalCode: [''],
    about: ['']
  });

  constructor(private authService: AuthService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.closeAllSubscriptions();
    this.runSubscriptions();
  }

  ngOnDestroy(): void {
    this.closeAllSubscriptions()
  }

  runSubscriptions() {
    // Obtiene el objeto completo del usuario y "pinta" los datos del componente
    this._userInfoSubs = this.authService.infoUser().subscribe(user => console.log('infoUser ', user));

    // Obtiene el objeto del usuario para que el componente pueda acceder a sus propiedades
    this._userSubs = this.authService.userObs$
          .subscribe( (user: User) => this.user = user );


  }

  closeAllSubscriptions() {
    if (this._userInfoSubs && !this._userInfoSubs.closed) this._userInfoSubs.unsubscribe();
    if (this._userSubs && !this._userSubs.closed) this._userSubs.unsubscribe();
  }

  // Ejecutada desde el formulario
  public changeUser() {
    if (this.miFormulario.invalid){
      return
    }
    const {name, lastName, address, city, country, postalCode, about} = this.miFormulario.value;
    this.authService.updateUser(name, lastName, address, city, country, postalCode, about).subscribe();
    console.log('Información actualizada...');
  }

}
