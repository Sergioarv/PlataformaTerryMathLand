import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';
import { GlobalConstant } from 'src/app/utils/constants/global.constants';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  authority: string = '';
  url_Cloudinary = GlobalConstant.URL_CLOUDINARY;

  constructor(
    private toastrService: ToastrService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.authority = this.tokenService.getRoles();
  }

}
