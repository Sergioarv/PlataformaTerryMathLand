import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.toastrService.success('mensajes.vueloEliminado','proceso Exitoso', { timeOut: 2000, closeButton: true});
  }

}
