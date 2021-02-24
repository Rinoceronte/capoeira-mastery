export const updateNotes = (notes) => {
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