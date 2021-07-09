import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

export const setItem = createAction(
    '[IngresoEgreso] Set Item',
    props<{ items: IngresoEgreso[] }>()
    );
export const unSetItem = createAction('[IngresoEgreso] Unset Item');
