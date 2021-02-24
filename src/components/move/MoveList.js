import './movelist.css';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {changeMove} from './state/actions';

import CollapsedList from '../CollapsedList';

const MoveList = () => {

    const dispatch = useDispatch();
    
    const [moves, setMoves] = useState([]);

    useEffect(() => {
        axios.get('/api/moves').then(res => {
            setMoves(res.data)
        }).catch(err => console.log(err));
    }, []);

    const changeMoveId = (id) => {
        console.log(id);
        axios.get(`/api/move/${id}`)
        .then(res => {
            dispatch(changeMove(res.data));
        }).catch(err => console.log(err));
    }


return (
        <div className='list'>
            <ul>
                {/* {moves.map((m, i) => <li key={i} onClick={() => changeMoveId(m.id)}>{m.name}</li>)} */}
                <CollapsedList list={moves} level='beginner' />
            </ul> 
        </div>
    )
}

export default MoveList;