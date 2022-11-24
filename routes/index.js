const homepageRoutes = require('./homepage');

const constructorMethod = (app) => {
    app.use('/homepage', homepageRoutes);
    app.use('*', (req, res) => {
        res.redirect('/homepage');
    });
};

module.exports = constructorMethod;
