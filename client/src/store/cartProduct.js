import { createSlice } from "@reduxjs/toolkit";

const initailState = {
  cart:[]
}

const cartSlice = createSlice({
  name:'cartItem',
  initialState:initailState,
  reducers:{
    handleAddItemCart : (state,action)=>{
      state.cart = [...action.payload]
    }
  }
})

export const {handleAddItemCart} = cartSlice.actions

export default cartSlice.reducer