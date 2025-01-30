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
export class ModalCriptomonedumComponent implements OnInit {
    formularioCriptomonedum:FormGroup;
    tituloAccion:string = "Agregar";
    botonAccion:string="Guardar";
    listaCriptomonedum: Criptomonedum[] = [];
    constructor(
      private modalActual: MatDialogRef<ModalCriptomonedumComponent>,
          @Inject(MAT_DIALOG_DATA) public datosCriptomonedum: Criptomonedum,
          private fb: FormBuilder,
          private _criptomonedumService: CriptomonedumService,
          private _utilidadService: UtilidadService,
    ){
      this.formularioCriptomonedum = this.fb.group({
        codigo: ['', Validators.required],
        nombre: ['', Validators.required],
        symbol: ['', Validators.required],
        descripcionCriptomonedum: ['', Validators.required],
        esActivo: ['1', Validators.required]
      });
      if(this.datosCriptomonedum != null){
        this.tituloAccion = "Editar";
        this.botonAccion = "Actualizar";
      }
    }
    ngOnInit(): void {
      if(this.datosCriptomonedum != null){
        this.formularioCriptomonedum.patchValue({
          idCriptomonedum: this.datosCriptomonedum.idCriptomonedum,
          codigo: this.datosCriptomonedum.codigo,
          nombre: this.datosCriptomonedum.nombre,
          symbol: this.datosCriptomonedum.symbol,
          descripcionCriptomonedum: this.datosCriptomonedum.descripcionCriptomonedum,
          esActivo: this.datosCriptomonedum.esActivo.toString()
        });
      }
    }
    guardarEditar_Criptomonedum(){
      const _criptomonedum: Criptomonedum ={
        idCriptomonedum: this.datosCriptomonedum == null ? 0 : this.datosCriptomonedum.idCriptomonedum,
        codigo: this.formularioCriptomonedum.value.codigo,
        nombre: this.formularioCriptomonedum.value.nombre,
        symbol : this.formularioCriptomonedum.value.symbol,
        descripcionCriptomonedum: this.formularioCriptomonedum.value.descripcionCriptomonedum,
        esActivo: parseInt(this.formularioCriptomonedum.value.esActivo)
      }
      if(this.datosCriptomonedum == null){
        this._criptomonedumService.guardar(_criptomonedum).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadService.mostrarAlerta("La Criptomoneda fue registrada", "Exito");
              this.modalActual.close("true");
            }else
              this._utilidadService.mostrarAlerta("No se pudo registrar la Criptomoneda","Error");
          },
          error:(e) => {}
        })
      }else{
        this._criptomonedumService.editar(_criptomonedum).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadService.mostrarAlerta("La Criptomoneda fue editada", "Exito");
              this.modalActual.close("true");
            }else
              this._utilidadService.mostrarAlerta("No se pudo editar la Criptomoneda","Error");
          },
          error:(e) => {}
        })
      }
    }
}
