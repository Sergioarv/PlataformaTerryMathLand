import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginUsuario } from 'src/app/models/loginUsuario';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  cargando = false;

  isLogged = false;
  loginUsuario!: LoginUsuario;

  roles: string[] = [];

  regNumeros = '[0-9]+';
  regNombre = '^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+[a-zA-ZÀ-ÿ]$';

  loginForm = new FormGroup({
    usuario: new FormControl('', [Validators.pattern(this.regNombre), Validators.required]),
    contrasenia: new FormControl('', [Validators.pattern(this.regNumeros), Validators.required])
  });

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.roles = this.tokenService.getAuthorities();
      this.router.navigate(['/inicio']);
    }
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario();
    this.loginUsuario.nombre = this.loginForm.controls['usuario'].value;
    this.loginUsuario.contrasenia = this.loginForm.controls['contrasenia'].value;

    this.authService.login(this.loginUsuario).subscribe(resp => {
      this.isLogged = true;

      this.tokenService.setToken(resp.data.token);
      this.tokenService.setUserName(resp.data.nombreUsuario);
      this.tokenService.setAuthorities(resp.data.authorities);
      this.roles = resp.data.authorities;
      this.router.navigate(['/inicio']);
    }, error => {
      this.isLogged = false;
      this.toastrService.error('Error en el login', 'Proceso fallido');
    });
  }

}
