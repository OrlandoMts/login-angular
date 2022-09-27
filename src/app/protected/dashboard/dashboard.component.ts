import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, of, Subscription, tap } from 'rxjs';
import { User } from 'src/app/auth/interfaces/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy{
  private _updateUserSub!: Subscription;
  private _infoUserSub!: Subscription;

  public user!: User;

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


  public userData(): void {
    this.authService.userObs.pipe(
      tap( data => {console.log('data: ', data); this.user = data;}),
      catchError(err => of(err))
    ).subscribe((data: User) => this.user = data); // (data: User) => this.user = data

    // this.authService.userObs.subscribe((data: User) => this.user = data); // (data: User) => this.user = data
  }

  constructor(private authService: AuthService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this._infoUserSub = this.authService.infoUser().subscribe();
    this.userData();
  }



  updateUser() {
    console.log('Información actualizada...');
    if (this.miFormulario.invalid){
      return
    }
    const {name, lastName, address, city, country, postalCode, about} = this.miFormulario.value;
    this._updateUserSub = this.authService.updateUser(name, lastName, address, city, country, postalCode, about).subscribe();
  }

  ngOnDestroy(): void {
    //TODO: Validar si existen
    this._infoUserSub.unsubscribe();
    this._updateUserSub.unsubscribe();
  }

}
