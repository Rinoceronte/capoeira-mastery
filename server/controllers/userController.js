const addNotes = async (req, res) => {
    let db = req.app.get('db');

    const move_id = req.params.move;
    const user_id = req.session.user.id;

    let notes;
    const result = await db.user.find_note([user_id, move_id])[0];
    if(result) {
        notes = await db.user.edit_note([user_id, move_id, req.body.notes]);
    } else {
        notes = await db.user.add_note([user_id, move_id, req.body.notes]);
    }
    if(notes) {
        return res.status(201).send(notes[0].notes);
    }
    return res.sendStatus(500);
}

const getNotes =  async (req, res) => {
    let db = req.app.get('db');
    const move_id = req.params.move;
    let user_id;
    if(req.session.user){
        user_id = req.session.user.id;
    }
    let notes;
    if(move_id && user_id){
        notes = await db.user.find_note([user_id, move_id]);
    }
    if(notes) {
        if(notes[0]){
            return res.status(200).send(notes[0]);
        }
    }
    return res.status(200).send({notes: ''});
}


module.exports = {
    addNotes,
    getNotes
}