import actions from "./actions";

const {
 ADD,SUB,RESET
} = actions;

export const INCREMENT = (payload)=>({
  type :ADD,
  payload :payload
})

export const DECREMENT = (payload)=>({
  type : SUB,
  payload :payload
})

export const RESETS = ()=>({
  type : RESET
})



