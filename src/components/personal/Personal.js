import {useState, useEffect} from 'react';
import './personal.css';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {updateNotes, updateFavorite} from './state/actions';
import {Alert} from '@material-ui/lab';

const Personal = () => {
    const [fav, setFav] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const dispatch = useDispatch();
    const {personalReducer, moveReducer} = useSelector(s => s);


    // console.log('pers', personalReducer.notes);
    useEffect(() => {
        axios.get(`/api/notes/${moveReducer.id}`).then(res => {
            dispatch(updateNotes(res.data))
            // setNotes(res.data.notes);
            // setFav(res.data.favorite);
        }).catch(err => console.log(err));
    }, [moveReducer.id]);

    useEffect(() => {
        setFav(personalReducer.favorite);
        setNotes(personalReducer.notes);
    }, [personalReducer]);



    const style = {color: fav ? 'yellow' : 'white', fontSize: '50px'}

    const updateNote = () => {
        axios.post(`/api/notes/${moveReducer.id}`, {notes}).then(res => {
            // console.log('update', res.data);
            dispatch(updateNotes(res.data));
        }).catch(err => console.log(err));
    }

    const saveFavorite = () => {
        console.log('fav');
        const newFav = !fav;
            axios.post(`/api/moves/favorite/${moveReducer.id}`, {newFav}).then(res => {
                setFav(newFav);
                dispatch(updateFavorite(newFav));
            }).catch(err => {
                if(err.response.status === 401) {
                    
                }
                console.log(err.response.status)
            });
    }


    return (
        <section className='personal'>
            <div className={`notes ${openNotes ? 'open' : 'closed'}`}>
                <section className='confirm'>
                    <button onClick={updateNote}>Save</button>
                    <button>Undo</button>
                </section>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}  />
            </div>
            <div className='end'>
                <label className='favorite'>Favorite: &nbsp; <span onClick={saveFavorite} style={style} >&#9733;</span></label>
                <button onClick={e => setOpenNotes(!openNotes)}>{openNotes ? 'close' : 'open'}</button>
            </div>
        </section>
    )
}

export default Personal;