const homeRoutes = require('./home');
const workoutsRoutes = require('./workouts');
const schedulerRoutes = require('./scheduler');
const communityRoutes = require('./community');
const aboutRoutes = require('./about');
const signupRoutes = require('./signup');
const loginRoutes = require('./login');
const profileRoutes = require('./profile');
const logoutRoutes = require('./logout');
const statsDiagram = require('./statsDiagram');
const communityPostRoutes = require('./communitypost');

const constructorMethod = (app) => {
    app.use('/home', homeRoutes);
    app.use('/workouts', workoutsRoutes);
    app.use('/scheduler', schedulerRoutes);
    app.use('/community', communityRoutes);
    app.use('/communitypost', communityPostRoutes);
    app.use('/about', aboutRoutes);
    app.use('/signup', signupRoutes);
    app.use('/login', loginRoutes);
    app.use('/profile', profileRoutes);
    app.use('/logout', logoutRoutes);
    app.use('/statsDiagram', statsDiagram)
    app.use('*', (req, res) => {
        res.redirect('/home');
    });
};

module.exports = constructorMethod;
