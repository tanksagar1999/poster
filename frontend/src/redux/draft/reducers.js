import actions from "./actions";

const {
 ADD,SUB,RESET
} = actions;

//state
const initialState = {
    counter : 0,
}


const Draftcounter = (state,action)=>{
   
    state = state || initialState

    switch(action.type){

        case ADD: return {
            ...state,
            counter : state.counter+1
        }

        case SUB:if(state.counter>0){ 
          return {
            ...state,
            counter : state.counter-1
            }
        }

        case RESET:return {
            counter : 0
        }
        
        default: return (
            state
          )
    }
}

export default Draftcounter



