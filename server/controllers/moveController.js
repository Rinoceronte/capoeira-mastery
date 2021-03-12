const getMoves = async (req, res) => {
    let db = req.app.get('db');

    // console.log(db);
    const results = await db.moves.get_moves();
    // console.log(results);

    if(results) {
        return res.status(200).send(results);
    }
}

const getFavMoves = async (req, res) => {
    let db = req.app.get('db');
    const results = await db.moves.get_fav_moves(req.session.user.id);
    if(results) {
        return res.status(200).send(results);
    }
    return res.sendStatus(500);
}

const getMove = async (req, res) => {
    let db = req.app.get('db');

    const results = await db.moves.get_move([req.params.id]);

    return res.status(200).send(results[0]);

}

const favMove = async (req, res) => {
    let db = req.app.get('db');
    console.log('fav');

    const move_id = +req.params.id;
    const {newFav} = req.body;
    const user_id = req.session.user.id;
    let [notes] = await (db.user.find_note([user_id, move_id]));
    if(notes){
        db.moves.favMove([user_id, move_id, newFav]).then(_ => {
            return res.sendStatus(200);
        }).catch(err => {
            console.log(err);
            return res.sendStatus(500);
        });
    }
    else {
        db.user.add_note([user_id, move_id, '']).then(_ => {
            db.moves.favMove([user_id, move_id, newFav]).then(_ => {
                return res.sendStatus(200)
            })
        }).catch(err => {
            console.log(err);
            return res.sendStatus(500);
        })
    }
}



module.exports = {
    getMoves,
    getFavMoves,
    getMove,
    favMove
}