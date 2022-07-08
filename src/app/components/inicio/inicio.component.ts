import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  isLogged = false;
  roles: string[] = [];
  authority: string = '';

  constructor(
    private toastrService: ToastrService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.authority = 'admin';
      } else if (rol === 'ROLE_DOCENTE') {
        this.authority = 'docente';
      } else if (rol === 'ROLE_ESTUDIANTE') {
        this.authority = 'estudiante';
      }
    });
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

}
