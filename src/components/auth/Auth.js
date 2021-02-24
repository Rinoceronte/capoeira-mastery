import './auth.css';
import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {updateUser, logout} from './state/actions';
import {updateNotes} from '../personal/state/actions';
import axios from 'axios';
import {Link} from 'react-router-dom';

const Auth = () => {

    // const [loggedinuser, setLoggedInUser] = useState({});
    const userInfo = useSelector(({authReducer}) => authReducer);
    const dispatch = useDispatch();
    // const {push} = useHistory();
    // console.log(userInfo);
    const [trylogin, setTryLogin] = useState(false);
    const [reg, setReg] = useState(false);
    const [user, setUser] = useState({username: '', password: '', verpassword: '', first_name: '', last_name: '', email: ''})
    const [regErrors, setRegErrors] = useState({username: false, password: false, verpassword: false, first: false, last: false, email: false});



    useEffect(() => {
        axios.get('api/auth/me').then(res => dispatch(updateUser(res.data))).catch(err => console.log(err));
    }, []);

    const checkEmail = () => {
           var pattern = new RegExp("^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$");
          
           return pattern.test(user.email);
    }

    const checkPassword = () => {
        var reg = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}~_+-=|]).{8,32}$");
        return reg.test(user.password);
    }

    const comparePasswords = () => {
        return user.password === user.verpassword;
    }

    const checkName = (n) => {
        let reg = new RegExp(/^[a-z ,.'-]+$/i);
        return reg.test(n);
    }

    const checkUser = () => {
        let reg = new RegExp(/^[a-z ,.'-]+$/i);
        return reg.test(user.username);
    }

    const login = () => {
        let u = checkUser();
        // push('/');
        setRegErrors({username: !u, password: false, verpassword: false, first: false, last: false, email: false});

        if(u && user.password != '')
        {
            axios.post('/api/auth/login', {username: user.username, password: user.password})
            .then(res => {
                dispatch(updateUser(res.data));
                setTryLogin(false);
                setReg(false);
                setUser({username: '', password: '', verpassword: '', first_name: '', last_name: '', email: ''});
                // setLoggedInUser(res.data);
                setRegErrors({username: false, password: false, verpassword: false, first: false, last: false, email: false});
            }).catch(err => console.log(err));
        }
    }

    const register = () => {
        let u = checkUser();
        let p = checkPassword();
        let vp = comparePasswords();
        let f = checkName(user.first_name);
        let l = checkName(user.last_name);
        let e = checkEmail();
        console.log(p);
        setRegErrors({username: !u, password: !p, verpassword: !vp, first: !f, last: !l, email: !e});
        if(u && p && vp && f && l && e)
        {
            axios.post('/api/auth/register', {...user}).then(res => {
                dispatch(updateUser(res.data));
                // setLoggedInUser(res.data);
                setRegErrors({username: false, password: false, verpassword: false, first: false, last: false, email: false});
                setUser({username: '', password: '', verpassword: '', first_name: '', last_name: '', email: ''});
                setTryLogin(false);
                setReg(false);
            }).catch(err => console.log(err));
        }
    }

    const alterUser = (cat, val) => {
        switch(cat){
            case 'username':
                setUser({...user, username: val});
            break;
            case 'password':
                setUser({...user, password: val});
            break;
            case 'verpassword':
                setUser({...user, verpassword: val});
            break;
            case 'first_name':
                setUser({...user, first_name: val});
            break;
            case 'last_name':
                setUser({...user, last_name: val});
            break;
            case 'email':
                setUser({...user, email: val});
            break;
            default: setUser({...user});
        }
    }

    const logout = () => {
        axios.post('/api/auth/logout').then(res => {
            dispatch(updateUser({username: '',
            first_name: '',
            last_name: '',
            email: ''}));
            dispatch(updateNotes({notes: '', favorite: false}));
            setRegErrors({username: false, password: false, verpassword: false, first: false, last: false, email: false});
            setUser({username: '', password: '', verpassword: '', first_name: '', last_name: '', email: ''})
        }).catch(err => console.log(err));
    }

    return (
        <div>
            {userInfo.username == '' || !userInfo.username ? <section className='auth'>
                <button onClick={e => {setTryLogin(!trylogin); setReg(false);}}>Login</button>
                <button onClick={e => {setReg(!reg); setTryLogin(false);}}>Register</button>
            </section> : <section className="auth"><button onClick={logout}>Logout</button> <Link to='/user'><h3>Change</h3></Link></section>}
            {trylogin && <div className='loginform'>
                            <label className='close' onClick={e => {setTryLogin(false); setReg(false);}}>X</label>
                            <section className='user row'><label>Username: <input type='text' onChange={e => alterUser('username', e.target.value)} value={user.username} placeholder='username'/></label>
                            {user.username == '' ? <p className='wrong'>Input a username</p> : <p className='wrong'></p> }</section>
                            <section className='user row'><label>Password: <input type='password' onChange={e => alterUser('password', e.target.value)} value={user.password} placeholder='password'/></label>
                            {user.password == '' ? <p className='wrong'>Input a password</p> : <p className='wrong'></p>}</section>
                            <button onClick={login}>LOGIN</button>
                         </div>}
            {reg && <div className='loginform'>
                            <label className='close' onClick={e => {setTryLogin(false); setReg(false);}}>X</label>
                            <section className='user row'><label><span>Username:</span> <input type='text' onChange={e => alterUser('username', e.target.value)} value={user.username} placeholder='username'/></label>
                            {regErrors.username ? <p className='wrong'>Input a username</p> : <p className='wrong'></p>}</section>
                            <section className='pass row'><label><span>Password:</span> <input type='password' onChange={e => alterUser('password', e.target.value)} value={user.password} placeholder='password'/></label>
                            {regErrors.password ? <p className='wrong'>Password must be 8 characters with 1 capital 1 special character and 1 number</p> : <p className='wrong'></p>}</section>
                            <section className='ver row'><label><span>Verify:</span> <input type='password' onChange={e => alterUser('verpassword', e.target.value)} value ={user.verpassword} placeholder='verify password'/></label>
                            {comparePasswords() ? <p className='wrong'></p> : <p className='wrong'>Passwords do not match</p>}</section>
                            <section className='first row'><label><span>First Name:</span> <input type='text' onChange={e => alterUser('first_name', e.target.value)} value={user.first_name} placeholder='first name'/></label>
                            {regErrors.first ? <p className='wrong'>Please input a first name</p> : <p className='wrong'></p>}</section>
                            <section className='last row'><label><span>Last Name:</span> <input type='text' onChange={e => alterUser('last_name', e.target.value)} value={user.last_name} placeholder='last name'/></label>
                            {regErrors.last ? <p className='wrong'>Please input a last name</p> : <p className='wrong'></p>}</section>
                            <section className='email row'><label><span>Email:</span> <input type='text' onChange={e => alterUser('email', e.target.value)} value={user.email} placeholder='email'/></label>
                            {regErrors.email ? <p className='wrong'>Please input a valid email</p> : <p className='wrong'></p>}</section>
                            <button onClick={() => register()}>REGISTER</button>
                         </div>}
        </div>
    )
}

// export default connect(null, {updateUser, logout})(Auth);
export default Auth;