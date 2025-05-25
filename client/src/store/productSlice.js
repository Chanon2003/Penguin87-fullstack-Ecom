import {createSlice} from '@reduxjs/toolkit'
 
const initialValue = {
  allCategory : [],
  loadingCategory:false,
  subCategory: [],
  allSubCategory:[],
  product : []
}

const productSlice = createSlice({
  name: 'product',
  initialState : initialValue,
  reducers:{
    setAllCategory : (state,action)=>{
      state.allCategory = [...action.payload]
    },
    setSubCategory: (state, action) => {
      state.subCategory = [...action.payload];
    },setAllSubCategory: (state, action) => {
      state.allSubCategory = [...action.payload];
    },
    setLoadingCategory:(state,action)=>{
      state.loadingCategory = action.payload
    },
  }
})

export const {setAllCategory,setSubCategory,setAllSubCategory,setLoadingCategory} = productSlice.actions

export default productSlice.reducer