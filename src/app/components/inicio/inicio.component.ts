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
  authority: string = '';

  constructor(
    private toastrService: ToastrService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.authority = this.tokenService.getRoles();
    console.log(this.authority);
  }

}
