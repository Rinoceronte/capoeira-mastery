const initialState = {
    id: 0,
    name: '',
    description: '',
    video: ''
}

export default function reducer(state = initialState, action)
{
    switch(action.type) {
        case 'CHANGE_MOVE':
            return {...state, ...action.payload}
        default:
            return state;
    }
}