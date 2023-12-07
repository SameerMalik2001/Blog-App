import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId:'',
    vlogId:'',
    Vtitle:'',
    Vstory:'',
    Vphoto:'',
    Vcat:'',
    EditVID:''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserId:(state, action) =>{
            state.userId = action.payload
        },
        setVlogId:(state, action) =>{
            state.vlogId = action.payload
        },
        setVlogDetails:(state, action)=>{
            const {title, content , category , photo , id} = action.payload
            state.Vtitle = title
            state.Vstory = content
            state.Vphoto = photo
            state.Vcat = category
            state.EditVID = id
        }



    }

})

export const { setUserId, setVlogId, setVlogDetails} = userSlice.actions

export default userSlice.reducer