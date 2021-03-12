import './movelist.css';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {changeMove, saveMoves} from './state/actions';

import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import Slide from '@material-ui/core/Slide';
import {FormControlLabel, Switch} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import Snackbar from '@material-ui/core/Snackbar';
import useDimensions from '../../Hooks/useDimensions';
import CollapsedList from '../CollapsedList';

const MoveList = () => {

    const dispatch = useDispatch();
    const moveInfo = useSelector(({moveReducer}) => moveReducer);
    
    const [moves, setMoves] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const {width} = useDimensions();
    const [favs, setFavs] = useState(false);

    useEffect(() => {
        axios.get('/api/moves').then(res => {
            dispatch(saveMoves(res.data));
            setMoves(res.data);
        }).catch(err => console.log(err));

        // let timeoutId = null;
        // const resizeListener = () => {
        //     clearTimeout(timeoutId);
        //     timeOutId = setTimeout(() => setWidth(getWidth()), 150);
        // }

        // window.addEventListener('resize', resizeListener);
    }, []);

    // const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    useEffect(() => {
        if(width > 767) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [width])

    const changeMoveId = (id) => {
        console.log(id);
        axios.get(`/api/move/${id}`)
        .then(res => {
            dispatch(changeMove(res.data));
        }).catch(err => console.log(err));
    }

    const toggleFavs = () => {
        axios.get(`/api/moves${favs ? '' : '/favs'}`).then(res => {
            setFavs(!favs)
            setMoves(res.data);
        }).catch(err => {
            if(err.response.status === 401)
            {
                setError(true);
            }
            console.log(err)
        });

    }



return (
    // className={`${open ? 'list' : 'closed-list' }`} className={`moves ${open ? 'menu-open' : 'menu-close'}`}
        <div className={`moves ${open ? 'list' : 'closed-list' }`}>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'left'}} open={error} onClose={() => setError(false)} message='You must be logged in to do that action' autoHideDuration={1000}/>
            {open ? <MenuOpenIcon onClick={() => setOpen(false)} className="menu"/> : <MenuIcon onClick={() => setOpen(true)} className="menu"/>}
                <label className='favorites'><span className='computer'>Favorites</span><span className='phone'>Favs</span> <input type="checkbox" value={favs} checked={favs} onChange={toggleFavs} /></label>

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
