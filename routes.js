Router.configure({  
    layoutTemplate: 'layout'
});

Router.route('/', {
    template: 'welcome'
});


Router.route('/search', {
    template: 'searchApiFilms',
});


Router.route('/hello', {
    template: 'hello',
});

/*Router.route('/search', function() {
    this.render('searchApiFilms');
});*/