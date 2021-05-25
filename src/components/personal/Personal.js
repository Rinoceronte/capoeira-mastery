
//view file

import {useState, useEffect} from 'react';
import './personal.css';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {updateNotes, updateFavorite} from './state/actions';
import {Alert} from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

const Personal = () => {
    const [fav, setFav] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const {personalReducer, moveReducer, authReducer} = useSelector(s => s);


    // console.log('pers', personalReducer.notes);
    useEffect(() => {
        axios.get(`/api/notes/${moveReducer.id}`).then(res => {
            // console.log(res.data)
            dispatch(updateNotes(res.data))
        }).catch(err => console.log(err));
    }, [moveReducer.id, authReducer]);

    useEffect(() => {
        setFav(personalReducer.favorite);
        setNotes(personalReducer.notes);
    }, [personalReducer]);



    const style = {color: fav ? 'yellow' : 'white'}

    const updateNote = () => {
        if(authReducer.username === '')
        {
            setOpen(true);
            return;
        }
        axios.post(`/api/notes/${moveReducer.id}`, {notes}).then(res => {
            // console.log('update', res.data);
            dispatch(updateNotes(res.data));
        }).catch(err => console.log(err));
    }

    const undo = () => {
        setNotes(personalReducer.notes);
    }

    const saveFavorite = () => {
        if(authReducer.username === '')
        {
            setOpen(true);
        } else {
            const newFav = !fav;
            axios.post(`/api/moves/favorite/${moveReducer.id}`, {newFav}).then(res => {
                setFav(newFav);
                dispatch(updateFavorite(newFav));
            }).catch(err => {
                console.log(err.response.status)
            });
        }
    }


    return (
        <section className='personal'>
            <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={open} onClose={() => setOpen(false)} message='You must be logged in to do that action' autoHideDuration={1000}/>
            <div className={`notes ${openNotes ? 'open' : 'closed'}`}>
                <section className='confirm'>
                    <button onClick={updateNote}>Save</button>
                    <button onClick={undo}>Undo</button>
                </section>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className='end'>
                <label className='favorite'>Favorite:  <span onClick={saveFavorite} style={style} >&#9733;</span></label>
                <button onClick={e => setOpenNotes(!openNotes)}>{openNotes ? 'Close' : 'Edit Notes'}</button>
            </div>
        </section>
    )
}

export default Personal;