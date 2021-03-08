export const changeMove = (move) => {
    return {
        type: 'CHANGE_MOVE',
        payload: move
    }
}

export const saveMoves = (moves) => {
    return {
        type: 'SAVE_MOVES',
        payload: moves
    }
}