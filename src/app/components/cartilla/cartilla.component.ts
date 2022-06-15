import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Cartilla } from 'src/app/models/cartilla';
import { Pregunta } from 'src/app/models/pregunta';
import { CartillaService } from 'src/app/services/cartilla.service';

@Component({
  selector: 'app-cartilla',
  templateUrl: './cartilla.component.html',
  styleUrls: ['./cartilla.component.css']
})
export class CartillaComponent implements OnInit {

  listaCartillas: Cartilla[];
  listaPreguntas: Pregunta[];

  cargando = false;

  regNumeros = '^[0-9]|[1-2][0-9]$';
  regTextoUnaLinea = '^[a-zA-ZÀ-ÿ\u00f1\u00d1\u0021-\u003f\u00bf\u00a1].[a-zA-ZÀ-ÿ\u00f1\u00d1\u0020-\u003f\u00bf\u00a1]+[a-zA-ZÀ-ÿ\u00f1\u00d1\u0021-\u003f\u00bf\u00a1]$';

  filtrarForm = new FormGroup({
    numcartilla: new FormControl('', [Validators.pattern(this.regNumeros)]),
    enunciado: new FormControl(''),
  });

  constructor(
    private toastrService: ToastrService,
    private cartillaService: CartillaService
  ) {
    this.listaCartillas = [];
    this.listaPreguntas = [];
  }

  ngOnInit(): void {
    this.obtenerCartillas();
  }

  obtenerCartillas() {
    this.cartillaService.obtenerCartillas().subscribe(resp => {
      this.listaCartillas = resp.data;

      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 4000, closeButton: true });
        this.cargando = false;
        this.filtrarForm.get('numcartilla')?.setValue(1);
        this.filtrar(1);
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
        this.cargando = false;
      }
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 4000, closeButton: true });
      this.cargando = false;
    });
  }

  filtrar(id?: any): void {

    this.cargando = true;

    const idCartilla = this.filtrarForm.controls['numcartilla'].value;

    this.cartillaService.filtrarPreguntasCartilla(idCartilla ? idCartilla : id ? id : null).subscribe(resp => {
      this.listaPreguntas = resp.data;
      if (resp.success) {
        this.toastrService.success(resp.message, 'Proceso exitoso', { timeOut: 5000, closeButton: true });
      } else {
        this.toastrService.error(resp.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
      }
      this.cargando = false;
    }, error => {
      this.toastrService.error(error.message, 'Proceso fallido', { timeOut: 5000, closeButton: true });
      this.cargando = false;
    });
  }

  limpiar(): void {
    this.filtrarForm.get('numcartilla')?.setValue("");
    this.filtrarForm.get('enunciado')?.setValue("");
    this.filtrar();
  }

}
