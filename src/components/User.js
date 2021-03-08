import axios from 'axios';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from './auth/state/actions';
import Dropzone from 'react-dropzone';
import {v4 as randomString} from 'uuid';

const User = () => {

    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [origPass, setOrigPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [verPass, setVerPass] = useState('');
    // const [pic, setPic] = useState();
    const [errors, setErrors] = useState({first: false, last: false, orig: false, newPass: false, verPass: false});
    
    const dispatch = useDispatch();

    const userInfo = useSelector(({authReducer}) => authReducer);

    useEffect(() => {
        setFirst(userInfo.first_name);
        setLast(userInfo.last_name);
    }, []);

    // useEffect(() => {
    //     console.log(pic);
    // }, [pic]);


    const checkPassword = () => {
        var reg = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}~_+-=|]).{8,32}$");
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
        console.log(first, last, origPass, verPass)
        let f = checkName(first);
        let l = checkName(last);
        let p = false;
        let vp = false;
        // console.log(newPass !== '', 'hmm')
        if(newPass !== ''){
            // console.log('test check')
            p = checkPassword();
            vp = comparePasswords();
        }

        setErrors({first: !f, last: !l, orig: false, newPass: !p, verPass: !vp});

        console.log(f, l, p, vp, origPass !== '')
        if((f && l && p && vp && origPass !=='') || newPass === '') {
            // console.log('fired');
            axios.post('/api/auth/update', {first, last, origPass, newPass, verPass})
            .then(res => dispatch(updateUser(res.data))).catch(err => {
                setErrors({...errors, orig: true});
                console.log(err);
            });
        }
    }

    const setFile = ([file]) => {
        console.log(file);
        setPic(file);
        const fileName = `${randomString()}-${file.name.replace(/\s/g, '-')}`;
    }

    return <div className='profileform'>
        <section className='row'><label><span>First Name:</span> <input type='text' onChange={e => setFirst(e.target.value)} value={first}/></label> {first === '' && <p className='wrong'>Input a valid first name</p>}</section>
        <section className='row'><label><span>Last Name:</span> <input type="text" onChange={e => setLast(e.target.value)} value={last}/></label> {last === '' && <p className='wrong'>Input a valid last name</p>}</section>
        <section className='row'><label><span>Password:</span><input type="password" onChange={e => setOrigPass(e.target.value)} /> </label>{errors.orig && <p className='wrong'>Invalid password</p>}</section>
        <section className='row'><label><span>New Password:</span> <input type='password' onChange={e => setNewPass(e.target.value)} /></label> {errors.newPass && <p className='wrong'>Use a strong password</p>}</section>
        <section className='row'><label><span>Verify Password:</span> <input type="password" onChange={e => setVerPass(e.target.value)} /></label> {verPass === newPass ? <p className='wrong'></p> : <p className='wrong'>Passwords do not match</p>}</section>
        {/* <section className='row'><label><span>Profile Picture:</span> <input type="file" onChange={e => setPic(e.target.files[0])} /></label></section> */}
        <Dropzone
            onDropAccepted={setFile}
            accept="image/*"
            multiple={false} className='files'>
            {({getRootProps, getInputProps}) => (
                <div 
                {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drop files here, or click to select files</p>
            </div>
            )}
        </Dropzone>
        <button onClick={update}>Update</button>
    </div>
}

export default User;