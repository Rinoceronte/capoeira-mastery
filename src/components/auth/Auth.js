import './auth.css';
import {useState, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {updateUser, logout} from './state/actions';
import {updateNotes} from '../personal/state/actions';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Snackbar from '@material-ui/core/Snackbar';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import axios from 'axios';
import {Link} from 'react-router-dom';

const Auth = () => {

    // const [loggedinuser, setLoggedInUser] = useState({});
    const userInfo = useSelector(({authReducer}) => authReducer);
    const dispatch = useDispatch();
    const location = useLocation();
    // const {push} = useHistory();
    // console.log(userInfo);
    const [trylogin, setTryLogin] = useState(false);
    const [reg, setReg] = useState(false);
    const [user, setUser] = useState({username: '', password: '', verpassword: '', first_name: '', last_name: '', email: ''})
    const [regErrors, setRegErrors] = useState({username: false, password: false, verpassword: false, first: false, last: false, email: false});
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);



    useEffect(() => {
        axios.get('api/auth/me').then(res => dispatch(updateUser(res.data))).catch(err => console.log(err));
        // console.log(location.pathname);
    }, []);

    const checkEmail = () => {
        var pattern = new RegExp(/^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/);
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
        // console.log('login')
        let u = checkUser();
        setRegErrors({username: !u, password: false, verpassword: false, first: false, last: false, email: false});

        if(user.username != '' && user.password != '')
        {
            axios.post('/api/auth/login', {username: user.username, password: user.password})
            .then(res => {
                dispatch(updateUser(res.data));
                setTryLogin(false);
                setReg(false);
                setUser({username: '', password: '', verpassword: '', first_name: '', last_name: '', email: ''});
                // setLoggedInUser(res.data);
                setRegErrors({username: false, password: false, verpassword: false, first: false, last: false, email: false});
            }).catch(err => {
                setOpen(true);
                console.log(err)
            });
        }
    }

    const register = () => {
        console.log('register')
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
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} onClose={() => setOpen(false)} message='Incorrect username or password.' autoHideDuration={2000}/>
            {userInfo.username == '' || !userInfo.username ? <section className='auth'>
                <button onClick={e => {setTryLogin(!trylogin); setReg(false);}}><span className='phone'><VpnKeyIcon /></span><span className='computer'>Login</span></button>
                <button onClick={e => {setReg(!reg); setTryLogin(false);}}><span className='phone'><HowToRegIcon /></span><span className='computer'>Register</span></button>
            </section> : <section className="auth">
                <Link to="/"><button onClick={logout} className='logout' >
                    <span className='phone'><ExitToAppIcon /></span><span className='computer'>Logout</span></button></Link> 
                    {location.pathname === '/user' ? 
                    <Link to="/" className="home-link"><HomeIcon className="home" /></Link> : 
                    <Link to='/user'>
                        {userInfo.profile_pic ? 
                            <Avatar alt='profile_img' src={userInfo.profile_pic}/> : 
                            <AccountCircleIcon className='profile'/>}
                    </Link>}</section>
            }{trylogin && <div className='loginform log'>
                            <label className='close' onClick={e => {setTryLogin(false); setReg(false);}}>X</label>
                            <section className='user row'><label className='form'><span>Username: </span><input type='text' autoFocus onChange={e => alterUser('username', e.target.value)} value={user.username} onKeyPress={e => {if(e.key === 'Enter') {login()}}}/></label>
                            {user.username == '' ? <p className='wrong'>Input a username</p> : <p className='wrong'></p> }</section>
                            <section className='user row'><label className='form'><span>Password:</span><input type='password' onChange={e => alterUser('password', e.target.value)} value={user.password} onKeyPress={e => {if(e.key === 'Enter') {login()}}} /></label>
                            {user.password == '' ? <p className='wrong'>Input a password</p> : <p className='wrong'></p>}</section>
                            <button onClick={login}>LOGIN</button>
                        </div>}
            {reg && <div className='loginform'>
                            <label className='close' onClick={e => {setTryLogin(false); setReg(false);}}>X</label>
                            <section className='user row'><label className='form'><span>Username:</span> <input type='text' autoFocus onChange={e => alterUser('username', e.target.value)} value={user.username} onKeyPress={e => {if(e.key === 'Enter') {register()}}}/></label>
                            {regErrors.username ? <span className='wrong'>Input a username</span> : <span className='wrong'></span>}</section>
                            <section className='pass row'><label className='form'><span>Password:</span> <input type='password' onChange={e => alterUser('password', e.target.value)} value={user.password} onKeyPress={e => {if(e.key === 'Enter') {register()}}}/></label>
                            {regErrors.password ? <span className='wrong'>Enter a strong password</span> : <span className='wrong'></span>}</section>
                            <section className='ver row'><label className='form'><span>Verify:</span> <input type='password' onChange={e => alterUser('verpassword', e.target.value)} value ={user.verpassword} onKeyPress={e => {if(e.key === 'Enter') {register()}}}/></label>
                            {comparePasswords() ? <span className='wrong'></span> : <span className='wrong'>Passwords do not match</span>}</section>
                            <section className='first row'><label className='form'><span>First Name:</span> <input type='text' onChange={e => alterUser('first_name', e.target.value)} value={user.first_name} onKeyPress={e => {if(e.key === 'Enter') {register()}}}/></label>
                            {regErrors.first ? <span className='wrong'>Please input a first name</span> : <span className='wrong'></span>}</section>
                            <section className='last row'><label className='form'><span>Last Name:</span> <input type='text' onChange={e => alterUser('last_name', e.target.value)} value={user.last_name} onKeyPress={e => {if(e.key === 'Enter') {register()}}}/></label>
                            {regErrors.last ? <span className='wrong'>Please input a last name</span> : <span className='wrong'></span>}</section>
                            <section className='email row'><label className='form'><span>Email:</span> <input type='text' onChange={e => alterUser('email', e.target.value)} value={user.email} onKeyPress={e => {if(e.key === 'Enter') {register()}}}/></label>
                            {regErrors.email ? <span className='wrong'>Please input a valid email</span> : <span className='wrong'></span>}</section>
                            <button onClick={() => register()}>Register</button>
                        </div>}
        </div>
    )
}

// export default connect(null, {updateUser, logout})(Auth);
export default Auth;
