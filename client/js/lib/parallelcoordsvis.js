ParallelCoordVis = function(_parentElement, _session) {
    var self = this;

    self.parentElement = _parentElement;

    self._data = _session.get('actorMovies');
    
    // initialize the data to be shown
    self.initData();

    self.displayData = [];
    self.initVis();
};


ParallelCoordVis.prototype.initVis = function () {

    var self = this; 

    self.svg = self.parentElement.select("svg");

    var width = 960,
        height = 500;


    // filter, aggregate, modify data
    // self.wrangleData(null);

    // call the update method
    // self.updateVis();


};

ParallelCoordVis.prototype.initDisplayData = function (_filterFunction) {
    var self = this;
    var i = 0;
    var data = [];

    for (i=0; i<self._data.length; i++){
        var movie = self._data[i];
        var releaseDate = moment(Date(movie.Released))
        if (!releaseDate.isAfer(moment.now())) {
            data.push(movie);
        }
    }
    self.data = data;
};


ParallelCoordVis.prototype.wrangleData = function (_filterFunction) {
    var self = this;

    // displayData should hold the data which is visualized
    self.displayData = self.filterAndAggregate(_filterFunction);
};


ParallelCoordVis.prototype.updateVis = function () {
    var self = this;
};



ParallelCoordVis.prototype.onSelectionChange = function (selectionStart, selectionEnd) {
    var self = this;
    
    self.wrangleData(function (data) {
        return (data.time <= selectionEnd && data.time >= selectionStart);
    });

    self.updateVis();
};



ParallelCoordVis.prototype.filterAndAggregate = function (_filter) {
    var self = this;

    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;};
    if (_filter !== null){
        filter = _filter;
    }
    
    var prio = d3.range(0, 16).map(function () {
        return 0;
    });

    // Implement the function that filters the data and sums the values
    self.data.filter(filter).forEach(function (datum) {
        d3.range(0, 16).forEach(function (index) {
            prio[index] += datum.prios[index];
        });
    });

    return prio;
};