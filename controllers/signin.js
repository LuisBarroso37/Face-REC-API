const jwt = require('jsonwebtoken');
const redis = require('redis');

// Setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (req, res, db, bcrypt) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return Promise.reject('Incorrect form submission');
    }

    return db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        
        if (isValid) {
            return db.select('*').from('users')
                     .where('email', '=', email)
                     .then(user => user[0])
                     .catch(err => Promise.reject('Unable to get user'));
        } else {
            Promise.reject('Wrong credentials');
        }
    })
    .catch(err => Promise.reject('Wrong credentials'));
}

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;

    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(400).json('Unauthorized');
        }

        return res.json({id: reply})
    });
}

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = (user) => {
    const { email, id } = user;
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
    return setToken(token, id)
           .then(() => {
               return {success: 'true', id, token}
           })
           .catch(console.log);
}

const signInAuthentication = (req, res, db, bcrypt) => {
    const { authorization } = req.headers;
    return authorization ? 
           getAuthTokenId(req, res) : 
           handleSignin(req, res, db, bcrypt)
           .then(user => {
               return user.id && user.email ? createSession(user) : Promise.reject('Error authenticating');
           })
           .then(session => res.json(session))
           .catch(err => res.status(400).json(err));
}

module.exports = {
    signInAuthentication,
    redisClient
}