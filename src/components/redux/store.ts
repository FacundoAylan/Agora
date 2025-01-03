// store.js
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usa localStorage por defecto
import reducer from './reducer';

// Configuración de redux-persist
const persistConfig = {
  key: 'root', // Clave para identificar el estado en localStorage
  storage,     // Usa localStorage para persistir el estado
  whitelist: ['users'], // Solo persistir la lista de usuarios
};

// Crear un reducer persistente
const persistedReducer = persistReducer(persistConfig, reducer);

// Crear el store usando el reducer persistente
const store = createStore(persistedReducer);

// Crear el persistor para sincronizar el almacenamiento
const persistor = persistStore(store);

export { store, persistor };
