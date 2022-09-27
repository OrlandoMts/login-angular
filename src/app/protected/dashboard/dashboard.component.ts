import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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

  public counter: number = 0;

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
    this.authService.infoUser().subscribe();
    this.userData();
  }

  ngOnDestroy(): void {
    if (this._userSubs && !this._userSubs.closed) this._userSubs.unsubscribe();
  }

  // Obtiene el objeto del usuario del servicio
  public userData() {
    this._userSubs = this.authService.userObs$
          .pipe(
            tap( data => console.log(data)),
            catchError(err => of(err))
          ).subscribe( (data: User) => this.printView(data));

    return this._userSubs;
  }

  // Ejecutada desde el formulario
  public changeUser() {
    if (this.miFormulario.invalid){
      return
    }
    this.counter +=1;
    const {name, lastName, address, city, country, postalCode, about} = this.miFormulario.value;
    this.authService.updateUser(name, lastName, address, city, country, postalCode, about).subscribe();
    console.log('Información actualizada...');
    // location.reload(); // Funciona pero no es lo que busco

    this.authService.infoUser().subscribe();
  }

  public printView(user: User) {
    if (!user) {
      return
    }
    this.user = user;
  }

}
