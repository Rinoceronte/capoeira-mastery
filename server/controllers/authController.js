const bcrypt = require('bcryptjs');
const aws = require('aws-sdk');
const {S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env;

const register = async (req, res) => {
    let {username, password, first_name, last_name, email} = req.body;
    let db = req.app.get('db');

    console.log('reg');
    const result = await db.user.find_user([username])[0];
    if(result) {
        return res.status(409).send('Username already exists');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const results = await db.user.create_user([username, hash, first_name, last_name, email]);
    const user = results[0];
    req.session.user = {username: user.username, first_name: user.first_name, last_name: user.last_name, email: user.email, id: user.id, profile_pic: user.profile_pic};
    return res.status(201).send(req.session.user);
}

const login = async (req, res) => {
    let {username, password} = req.body;
    let db = req.app.get('db');
    let result = await db.user.find_user([username]);
    let user = result[0];
    if(!user) {
        return res.status(401).send('Invalid username or password');
    }
    const isAuthenticated = bcrypt.compareSync(password, user.password);
    if(!isAuthenticated)
    {
        return res.status(401).send('Invalid username or password');
    }
    req.session.user = {username: user.username, first_name: user.first_name, last_name: user.last_name, email: user.email, id:user.id, profile_pic: user.profile_pic};
    return res.status(201).send(req.session.user);
}

const logout = (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
}

const getUser = (req, res) => {
    if(req.session.user) {
        return res.status(201).send(req.session.user);
    }
    return res.sendStatus(404);
}

const upload = async (pic) => {
    aws.config = {
        region: 'us-west-1',
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }

    const s3 = new aws.S3();
    const s3Params = {
        Bucket: S3_BUCKET,
        key: pic.name,
        expires: 60, 
        ContentType: pic.type,
        ACL: 'public-read'
    }

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        return returnData;
    })
}

const updateUser = async (req, res) => {
    let {first, last, origPass, newPass} = req.body;
    let db = req.app.get('db');
    let result = await db.user.find_user([req.session.user.username]);
    let user = result[0];
    let updatedUser;
    // let picLocation = user.profile_pic;

    // if(pic) {
    //     picLocation = await upload(pic)
    // }

    // console.log(newPass, 'pass change', user)


    if(!user) {
        return res.status(403).send('Login to update');
    }

    if(newPass) {
        // console.log('new pass?')
        const isAuthenticated = bcrypt.compareSync(origPass, user.password);
        if(!isAuthenticated) {
            return res.status(401).send('Incorrect password');
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPass, salt);
        updatedUser = await db.user.update_user([user.id, first, last, hash]);
    }
    else {
        // console.log(user.id, first, last, user.password)
        updatedUser = await db.user.update_user([user.id, first, last, user.password])
    }
    req.session.user = {username: updatedUser.username, first_name: updatedUser.first_name, last_name: updatedUser.last_name, email: updatedUser.email, id:updatedUser.id, profile_pic: updatedUser.profile_pic};
    return res.status(200).send(req.session.user);
}

module.exports = {
    register,
    login,
    logout,
    getUser,
    updateUser
}