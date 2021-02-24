import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {changeMove} from './move/state/actions';
import axios from 'axios';
import '../App.css';

const CollapsedList = (props) => {

    const dispatch = useDispatch();
    const [collapse, setCollapse] = useState(false);

    const changeMoveId = (id) => {
        axios.get(`/api/move/${id}`)
        .then(res => {
            dispatch(changeMove(res.data));
        }).catch(err => console.log(err));
    }

    let l = props.list.map((m, i) => {
        return <li key={i} onClick={() => changeMoveId(m.id)}>{m.name}</li>
    })

    const changeCollapse = () => {
        setCollapse(!collapse);
    }



    return (
        <section className={props.level}>
            <label onClick={changeCollapse}>{collapse ? '+' : '-'}</label>
            <ul className={collapse ? 'collapse' : ''}>
                {l}
            </ul>
        </section>
    )
}

export default CollapsedList;