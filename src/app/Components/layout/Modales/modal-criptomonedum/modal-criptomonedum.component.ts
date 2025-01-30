import { Component, OnInit, Inject } from '@angular/core';
import { SharedModule } from '../../../../Reutilizable/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Criptomonedum } from '../../../../Interfaces/criptomonedum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CriptomonedumService } from '../../../../Services/criptomonedum.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-criptomonedum',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal-criptomonedum.component.html',
  styleUrl: './modal-criptomonedum.component.css'
})
export class ModalCriptomonedumComponent {
  formularioCriptomonedum: FormGroup;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaCriptomonedum: Criptomonedum[] = [];
  constructor(
    private modalActual: MatDialogRef<ModalCriptomonedumComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: { criptomonedum: Criptomonedum, lista: Criptomonedum[] },
    private fb: FormBuilder,
    private _criptomonedumService: CriptomonedumService,
    private _utilidadService: UtilidadService,
  ) {
    this.listaCriptomonedum = datos.lista;
    this.formularioCriptomonedum = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      symbol: ['', Validators.required],
      descripcion: ['', Validators.required],
      esActivo: ['1', Validators.required]
    });

    if (datos.criptomonedum != null) {
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
      this.formularioCriptomonedum.patchValue({
        idCriptomonedum: datos.criptomonedum.idCriptomonedum,
        codigo: datos.criptomonedum.codigo,
        nombre: datos.criptomonedum.nombre,
        symbol: datos.criptomonedum.symbol,
        descripcion: datos.criptomonedum.descripcion,
        esActivo: datos.criptomonedum.esActivo.toString()
      });
    }
  }
  guardarEditar_Criptomonedum() {
    const _criptomonedum: Criptomonedum = {
      idCriptomonedum: this.datos.criptomonedum == null ? 0 : this.datos.criptomonedum.idCriptomonedum,
      codigo: this.formularioCriptomonedum.value.codigo,
      nombre: this.formularioCriptomonedum.value.nombre,
      symbol: this.formularioCriptomonedum.value.symbol,
      descripcion: this.formularioCriptomonedum.value.descripcion,
      esActivo: parseInt(this.formularioCriptomonedum.value.esActivo)
    };

    // Validación de código único
    const codigoExiste = this.listaCriptomonedum.some(cripto => cripto.codigo === _criptomonedum.codigo && cripto.idCriptomonedum !== _criptomonedum.idCriptomonedum);
    if (codigoExiste) {
      this._utilidadService.mostrarAlerta("El código ya existe en la lista", "Error");
      return;
    }

    if (this.datos.criptomonedum == null) {
      this._criptomonedumService.guardar(_criptomonedum).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadService.mostrarAlerta("La Criptomoneda fue registrada", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadService.mostrarAlerta("No se pudo registrar la Criptomoneda", "Error");
          }
        },
        error: (e) => { }
      });
    } else {
      this._criptomonedumService.editar(_criptomonedum).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadService.mostrarAlerta("La Criptomoneda fue editada", "Exito");
            this.modalActual.close("true");
          } else {
            this._utilidadService.mostrarAlerta("No se pudo editar la Criptomoneda", "Error");
          }
        },
        error: (e) => { }
      });
    }
  }

}
