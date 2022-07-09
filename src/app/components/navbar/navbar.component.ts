import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLogged = false;
  roles: string[] = [];
  authority: string = '';

  constructor(
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.authority = this.tokenService.getRoles();
    this.isLogged = this.tokenService.isLogged();
  }

  onLogOut(): void {
    this.tokenService.logOut();
  }

}
