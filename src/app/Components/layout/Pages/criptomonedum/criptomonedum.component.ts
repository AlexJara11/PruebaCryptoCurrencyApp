import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { Criptomonedum } from '../../../../Interfaces/criptomonedum';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import { CriptomonedumService } from '../../../../Services/criptomonedum.service';
import { ModalCriptomonedumComponent } from '../../Modales/modal-criptomonedum/modal-criptomonedum.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-criptomonedum',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './criptomonedum.component.html',
  styleUrl: './criptomonedum.component.css'
})
export class CriptomonedumComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = ['codigo', 'nombre', 'descripcion', 'estado', 'acciones'];
  dataInicio: Criptomonedum[] = [];
  dataListaCriptomonedum = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
  constructor(
    private dialog: MatDialog,
    private _criptomonedumService: CriptomonedumService,
    private _utilidadService: UtilidadService
  ) { }
  obtenerCriptomonedas() {
    this._criptomonedumService.lista().subscribe({
      next: (data) => {
        if (data.status)
          this.dataListaCriptomonedum.data = data.value;
        else
          this._utilidadService.mostrarAlerta("No se encontraron datos", "Oops!");
      },
      error: (e) => { }
    })
  }
  ngOnInit(): void {
    this.obtenerCriptomonedas();
  }
  ngAfterViewInit(): void {
    this.dataListaCriptomonedum.paginator = this.paginacionTabla;
  }
  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaCriptomonedum.filter = filterValue.trim().toLocaleLowerCase();
  }
  nuevaCriptomoneda() {
    this.dialog.open(ModalCriptomonedumComponent, {
      disableClose: true,
      data: { criptomonedum: null, lista: this.dataListaCriptomonedum.data }
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.obtenerCriptomonedas();
      }
    });
  }

  editarCriptomoneda(criptomonedum: Criptomonedum) {
    this.dialog.open(ModalCriptomonedumComponent, {
      disableClose: true,
      data: { criptomonedum, lista: this.dataListaCriptomonedum.data }
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") {
        this.obtenerCriptomonedas();
      }
    });
  }
  eliminarCriptomoneda(criptomonedum: Criptomonedum) {
    Swal.fire({
      title: '¿Desea eliminar la criptomoneda de la base de datos?',
      text: criptomonedum.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Sí, eliminar",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._criptomonedumService.eliminar(criptomonedum.codigo).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadService.mostrarAlerta("La criptomoneda fue eliminada de la base de datos", "Listo!");
              this.obtenerCriptomonedas();
            } else
              this._utilidadService.mostrarAlerta("No se pudo eliminar la criptomoneda o no se encuentra registrada en base de datos", "Error");
          },
          error: (e) => { }
        })
      }
    });
  }
}
