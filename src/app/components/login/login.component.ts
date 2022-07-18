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
  }

  onLogin(): void {
    this.cargando = true;
    this.loginUsuario = new LoginUsuario();
    this.loginUsuario.nombre = this.loginForm.controls['usuario'].value;
    this.loginUsuario.contrasenia = this.loginForm.controls['contrasenia'].value;

    this.authService.login(this.loginUsuario).subscribe(resp => {
      if (resp.success) {
        this.tokenService.setToken(resp.data.token);
        this.roles = resp.data.authorities;
        this.router.navigate(['/inicio']);
        this.cargando = false;
      }else{
        this.toastrService.error(resp.message, 'Proceso fallido');
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error('Error en el servidor', 'Proceso fallido');
      this.cargando = false;
    });
  }

}
