import './movelist.css';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {changeMove} from './state/actions';

import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import Slide from '@material-ui/core/Slide';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import CollapsedList from '../CollapsedList';

const MoveList = () => {

    const dispatch = useDispatch();
    
    const [moves, setMoves] = useState([]);
    const [open, setOpen] = useState(false);

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
    // className={`${open ? 'list' : 'closed-list' }`} className={`moves ${open ? 'menu-open' : 'menu-close'}`}
        <div className={`moves ${open ? 'list' : 'closed-list' }`}>
            {open ? <MenuOpenIcon onClick={() => setOpen(false)} className="menu"/> : <MenuIcon onClick={() => setOpen(true)} className="menu"/>}
                <Slide direction="right" in={open} timeout={500} mountOnEnter unmountOnExit>
                    <TreeView 
                    defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
                        {/* <TreeItem nodeId='0' label='Beginner'> */}
                            {moves.map((m, i) => <TreeItem nodeId={`${i}`} key={i} label={m.name} onClick={() => changeMoveId(m.id)} />)} 
                        {/* </TreeItem> */}
                    </TreeView>
                </Slide>
        </div>
    )
}

export default MoveList;