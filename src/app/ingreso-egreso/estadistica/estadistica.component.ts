import { Component, OnInit } from '@angular/core';

import { MultiDataSet, Label, Color } from 'ng2-charts';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartColors: Color[] = [{backgroundColor: ['#00ce68', '#e65251']}];
  public doughnutChartData: MultiDataSet = [[]];

  ingresos = 0;
  egresos = 0;
  totalIngresos = 0;
  totalEgresos = 0;

  constructor( private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('ingresosEgresos').subscribe( ({ items }) => this.generarEstadisticas( items ));
  }

  generarEstadisticas( items: IngresoEgreso[]) {

    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.egresos = 0;
    this.ingresos = 0;

    for (const item of items) {
      if ( item.tipo === 'ingreso') {
        this.ingresos ++;
        this.totalIngresos += item.monto;
      } else {
        this.egresos ++;
        this.totalEgresos += item.monto;
      }
    }

    this.doughnutChartData = [[this.totalIngresos, this.totalEgresos]];
  }

}
