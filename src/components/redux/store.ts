import { createStore } from 'redux';
import reducer from './reducer';

// Crear el store usando el reducer
const store = createStore(reducer);

// Exporta los tipos
export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;

export { store };
