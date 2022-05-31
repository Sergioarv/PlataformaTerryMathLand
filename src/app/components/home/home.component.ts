import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.toastrService.success('mensajes.vueloEliminado','proceso Exitoso', { timeOut: 2000, closeButton: true});
  }

}
