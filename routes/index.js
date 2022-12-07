const homeRoutes = require('./home');
const workoutsRoutes = require('./workouts');
const schedulerRoutes = require('./scheduler');
const communityRoutes = require('./community');
const communitypostRoutes = require ('./communitypost')
const aboutRoutes = require('./about');
const signupRoutes = require('./signup');
const loginRoutes = require('./login');
const profileRoutes = require('./profile');
const logoutRoutes = require('./logout');

const constructorMethod = (app) => {
    app.use('/home', homeRoutes);
    app.use('/workouts', workoutsRoutes);
    app.use('/scheduler', schedulerRoutes);
    app.use('/community', communityRoutes);
    app.use('/communitypost', communitypostRoutes);
    app.use('/about', aboutRoutes);
    app.use('/signup', signupRoutes);
    app.use('/login', loginRoutes);
    app.use('/profile', profileRoutes);
    app.use('/logout', logoutRoutes);
    app.use('*', (req, res) => {
        res.redirect('/home');
    });
};

module.exports = constructorMethod;
