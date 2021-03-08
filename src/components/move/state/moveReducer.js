const initialState = {
    id: 0,
    name: '',
    description: '',
    video: '',
    moves: []
}

export default function reducer(state = initialState, action)
{
    switch(action.type) {
        case 'CHANGE_MOVE':
            return {...state, ...action.payload};
        case 'SAVE_MOVES':
            return {...state, moves: action.payload};
        default:
            return state;
    }
}