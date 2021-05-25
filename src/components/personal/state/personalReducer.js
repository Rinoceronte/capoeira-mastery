//model file

const initialState = {
    notes: '',
    favorite: false
}

export default function reducer(state = initialState, action)
{
    switch(action.type) {
        case 'UPDATE_NOTES':
            return {...state, ...action.payload}
        case 'CHANGE_FAVORITE':
            return {...state, ...action.payload}
        default:
            return state;
    }
}