Router.configure({  
    layoutTemplate: 'layout'
});

Router.route('/', {
    template: 'welcome',
});


Router.route('/search', {
    template: 'searchApiFilms',
});


Router.route('/hello', {
    template: 'hello',
});

Router.route('/results', {
    template: 'results',
});


Router.route('/loading', {
    template: 'loading',
});

/*Router.route('/search', function() {
    this.render('searchApiFilms');
});*/
Router.onBeforeAction(function() {
    if (Session.get('actorSearched')) {
        // this.render('welcome');
        this.next();
    } else {
      // this.render('home');
      console.log('actor!!')
      this.render('welcome')
      // this.next();
    }
});