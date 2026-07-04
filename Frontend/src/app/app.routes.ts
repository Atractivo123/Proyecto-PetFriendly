import { Routes } from '@angular/router';

import { Layout } from './shared/layout/layout';

import { Dashboard } from './pages/dashboard/dashboard';
import { Clientes } from './pages/clientes/clientes';
import { Mascotas } from './pages/mascotas/mascotas';
import { Agenda } from './pages/agenda/agenda';
import { Inventario } from './pages/inventario/inventario';
import { Ventas } from './pages/ventas/ventas';
import { Reportes } from './pages/reportes/reportes';

export const routes: Routes = [

  {
    path: '',
    component: Layout,
    children: [

      { path: '', component: Dashboard },

      { path: 'clientes', component: Clientes },

      { path: 'mascotas', component: Mascotas },

      { path: 'agenda', component: Agenda },

      { path: 'inventario', component: Inventario },

      { path: 'ventas', component: Ventas },

      { path: 'reportes', component: Reportes }

    ]

  },

  {
    path: '**',
    redirectTo: ''
  }

];