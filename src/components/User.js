import axios from 'axios';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from './auth/state/actions';
import Dropzone from 'react-dropzone';
import {v4 as randomString} from 'uuid';
import {useHistory} from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { LensTwoTone } from '@material-ui/icons';

const User = () => {

    const [saving, setSaving] = useState(false)
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [origPass, setOrigPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [verPass, setVerPass] = useState('');
    // const [picInfo, setPicInfo] = useState({fileType: '', fileName: ''});
    const [pic, setPic] = useState({path: '', name: ''});
    const [errors, setErrors] = useState({first: false, last: false, orig: false, newPass: false, verPass: false});
    
    const dispatch = useDispatch();
    let history = useHistory();

    const userInfo = useSelector(({authReducer}) => authReducer);

    useEffect(() => {
        axios.get('/api/auth/me').then(res => {
            setFirst(res.data.first_name);
            setLast(res.data.last_name);
            // console.log(res);
        }).catch(err => history.push("/"));
    }, []);

    const checkPassword = () => {
        const reg = new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/);
        console.log(newPass, reg.test('aaaaBBB12#$%'));
        return reg.test(newPass);
    }

    const comparePasswords = () => {
        return newPass === verPass;
    }

    const checkName = (n) => {
        let reg = new RegExp(/^[a-z ,.'-]+$/i);
        return reg.test(n);
    }

    const update = () => {
        // console.log(first, last, origPass, verPass)
        let f = checkName(first);
        let l = checkName(last);
        let p = false;
        let vp = false;
        if(newPass !== ''){
            console.log('check check')
            p = checkPassword();
            vp = comparePasswords();
        }


        console.log(f, l, p, vp, origPass !== '', newPass === '');
        if((f && l && p && vp && origPass !=='') || newPass === '') {
            if(newPass === '') {
                setErrors({first: !f, last: !f, orig: false, newPass: false, verPass: false});
            } else {
                setErrors({first: !f, last: !l, orig: false, newPass: !p, verPass: !vp});
            }
            setSaving(true);
            // console.log('fired');
            // console.log(pic);
            const fileName = `${randomString()}-${pic.name.replace(/\s/g, '-')}`;
            axios.post('/api/auth/update', {first, last, origPass, newPass, verPass, fileType: pic.type, fileName})
            .then(res => {
                let {username, first_name, last_name, email, id, profile_pic} = res.data.user;
                dispatch(updateUser({username, first_name, last_name, email, id}));
                if(res.data.signedRequest) {
                    uploadFile(pic, res.data.signedRequest, profile_pic)
                } else {
                    setSaving(false);
                }
            }).catch(err => {
                setErrors({...errors, orig: true});
                setSaving(false);
                console.log(err);
            });
        } else {
            setErrors({first: !f, last: !f, orig: false, newPass: !p, verPass: !vp});
        }
    }

    const uploadFile = (file, signedRequest, profile_pic) => {
        // console.log('upload files');
        const options = {
            headers: {'Content-Type': file.type}
        };


        axios.put(signedRequest, file, options)
        .then(response => {
            dispatch(updateUser({profile_pic}));
            setPic({path: '', name: ''});
            setSaving(false);
        }).catch(err => {
            if(err.response.status === 403) {
                console.log('signed url failed with 403');
            }
            else {
                console.log(err);
            }
        })
    }

    return <div className='profileform'>
        {/* <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} onClose={() => setOpen(false)} message='Incorrect username or password.' autoHideDuration={2000}/> */}
        <section className='row'><label><span>First Name:</span> <input type='text' onChange={e => setFirst(e.target.value)} value={first} onKeyPress={e => {if(e.key === 'Enter') {update()}}}/></label> 
        {first === '' && <p className='wrong'>Input a valid first name</p>}</section>
        <section className='row'><label><span>Last Name:</span> <input type="text" onChange={e => setLast(e.target.value)} value={last} onKeyPress={e => {if(e.key === 'Enter') {update()}}}/></label> 
        {last === '' && <p className='wrong'>Input a valid last name</p>}</section>
        <section className='row'><label><span>Password:</span><input type="password" onChange={e => setOrigPass(e.target.value)} onKeyPress={e => {if(e.key === 'Enter') {update()}}}/> </label>
        {errors.orig && <p className='wrong'>Invalid password</p>}</section>
        <section className='row'><label><span>New Password:</span> <input type='password' onChange={e => setNewPass(e.target.value)} onKeyPress={e => {if(e.key === 'Enter') {update()}}}/></label> 
        {errors.newPass && <p className='wrong'>Use a strong password</p>}</section>
        <section className='row'><label><span>Verify Password:</span> <input type="password" onChange={e => setVerPass(e.target.value)} onKeyPress={e => {if(e.key === 'Enter') {update()}}}/></label> 
        {verPass === newPass ? <p className='wrong'></p> : <p className='wrong'>Passwords do not match</p>}</section>
        {/* <section className='row'><label><span>Profile Picture:</span> <input type="file" onChange={e => setPic(e.target.files[0])} /></label></section> */}
        <Dropzone
            onDropAccepted={([file]) => {setPic(file)}}
            accept="image/*"
            multiple={false} className='files'>
            {({getRootProps, getInputProps}) => (
                <div 
                {...getRootProps()}>
                <input {...getInputProps()} />
                {pic.name ? <p>{pic.name}</p> : <p>Click or Drag to add a profile picture!</p>}
            </div>
            )}
        </Dropzone>
        <section className="update">{saving ? <CircularProgress /> : <button onClick={update}>Update</button> }</section>
    </div>
}

export default User;