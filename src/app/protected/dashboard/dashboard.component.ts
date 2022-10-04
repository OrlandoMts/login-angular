import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, Observer, of, Subscription, tap } from 'rxjs';
import { AuthResponse, User } from 'src/app/auth/interfaces/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  public user!: User;
  private _userSubs!: Subscription;

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
    this.runSubscriptions();
  }

  ngOnDestroy(): void {
    this.closeAllSubscriptions()
  }

  runSubscriptions() {
    this.authService.infoUser();
    this._userSubs = this.authService.userObs$.subscribe( (_user: User| undefined) => _user && (this.user = _user) && ( this.miFormulario.get("email")?.setValue(_user?.email) ) );
  }

  closeAllSubscriptions() {
    if (this._userSubs && !this._userSubs.closed) this._userSubs.unsubscribe();
  }

  // Ejecutada desde el formulario
  public changeUser() {
    if (this.miFormulario.invalid) return;
    const {name, lastName, address, city, country, postalCode, about} = this.miFormulario.value;
    this.authService.updateUser(name, lastName, address, city, country, postalCode, about);
    // this.miFormulario.get("name")?.setValue(name);
    console.log('Información actualizada...');
  }
}
