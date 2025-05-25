import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'; // เพิ่มการรวม reducers
import userReducer from './userSlice';
import productReducer from './productSlice';
import cartReducer from './cartProduct';
import addressReducer from './addressSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // ใช้ LocalStorage สำหรับการเก็บข้อมูล

// การตั้งค่า persist สำหรับแต่ละ reducer
const persistConfig = {
  key: 'root',
  storage, // กำหนดให้ใช้ LocalStorage

};

// รวม reducers ทั้งหมดเข้าด้วยกัน
const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  cartItem: cartReducer,
  address: addressReducer,
});

// ใช้ persistReducer สำหรับ rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// การตั้งค่า store โดยใช้ persistedReducer
export const store = configureStore({
  reducer: persistedReducer,
   // ใช้ persisted reducer
});

// สร้าง persistor
export const persistor = persistStore(store);
