const homepageRoutes = require('./homepage');
const workoutsRoutes = require('./workouts');
const schedulerRoutes = require('./scheduler');
const communityRoutes = require('./community');
const aboutRoutes = require('./about');
const signupRoutes = require('./signup');
const loginRoutes = require('./login');
const profileRoutes = require('./profile');

const constructorMethod = (app) => {
    app.use('/homepage', homepageRoutes);
    app.use('/workouts', workoutsRoutes);
    app.use('/scheduler', schedulerRoutes);
    app.use('/community', communityRoutes);
    app.use('/about', aboutRoutes);
    app.use('/signup', signupRoutes);
    app.use('/login', loginRoutes);
    app.use('/profile', profileRoutes);
    app.use('*', (req, res) => {
        res.redirect('/homepage');
    });
};

module.exports = constructorMethod;
