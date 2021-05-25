//controller file

export const updateNotes = (notes) => {
    if(!notes.favorite){
        notes.favorite = false;
    }
    return {
        type: 'UPDATE_NOTES',
        payload: notes
    }
}

export const updateFavorite = (favorite) => {
    return {
        type: 'CHANGE_FAVORITE',
        payload: {favorite}
    }
}

