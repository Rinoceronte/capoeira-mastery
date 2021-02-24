import axios from 'axios';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from './auth/state/actions';

const User = () => {

    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [origPass, setOrigPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [verPass, setVerPass] = useState('');
    const [errors, setErrors] = useState({first: false, last: false, orig: false, newPass: false, verPass: false});
    
    const dispatch = useDispatch();

    const userInfo = useSelector(({authReducer}) => authReducer);

    useEffect(() => {
        setFirst(userInfo.first_name);
        setLast(userInfo.last_name);
    }, []);

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
        let f = checkName(first);
        let l = checkName(last);
        let p = checkPassword();
        let vp = comparePasswords();
        setErrors({first: !f, last: !l, orig: false, newPass: !p, verPass: !vp});

        if(f && l && p && vp) {
            axios.post('/api/auth/update', {first, last, origPass, newPass, verPass})
            .then(res => dispatch(updateUser(res.data))).catch(err => {
                setErrors({...errors, orig: true});
                console.log(err);
            });
        }
    }

    return <div>
        <section><label>First Name: <input type='text' onChange={e => setFirst(e.target.value)} value={first}/></label> {errors.first && <p class='wrong'>Input a valid first name</p>}</section>
        <section><label>Last Name: <input type="text" onChange={e => setLast(e.target.value)} value={last}/></label> {errors.last && <p class='wrong'>Input a valid last name</p>}</section>
        <section><label>Password:<input type="password" onChange={e => setOrigPass(e.target.value)} /> </label>{errors.orig && <p class='wrong'>Input a valid first name</p>}</section>
        <section><label>New Password: <input type='password' onChange={e => setNewPass(e.target.value)} /></label> {errors.newPass && <p class='wrong'>Input a valid first name</p>}</section>
        <section><label>Verify Password: <input type="password" onChange={e => setVerPass(e.target.value)} /></label> {errors.verPass && <p class='wrong'>Input a valid first name</p>}</section>
        <button onClick={update}>Update</button>
    </div>
}

export default User;