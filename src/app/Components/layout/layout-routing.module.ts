import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { CriptomonedumComponent } from './Pages/criptomonedum/criptomonedum.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    { path: 'usuarios', component: UsuarioComponent },
    { path: 'Criptomonedas/lista', component: CriptomonedumComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
