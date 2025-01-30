import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsettings } from '../Settings/appsettings';
import { ResponseApi } from '../Interfaces/response-api';
import { Criptomonedum } from '../Interfaces/criptomonedum';
@Injectable({
  providedIn: 'root'
})
export class CriptomonedumService {
  private urlApi = appsettings.apiUrl + 'CriptoMoneda/';
  constructor(private http:HttpClient) { }
  lista(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }
  guardar(request: Criptomonedum): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }
  editar(request: Criptomonedum): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }
  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
