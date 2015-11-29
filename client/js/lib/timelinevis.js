// maybe we could do a grid of moves and their genres? 
// like a matrix
// http://codepen.io/bishopsmove/pen/AlHmc


TimeLineVis = function(_parentElement, _session) {
    var self = this;

     self.timelineVisKeys = [
        'Title',
        'Year',
        'imdbRating',
        'tomatoRating',
        'tomatoUserRating'
    ]

    self.parentElement = _parentElement;

    self.data = nanToZero(
        _session.get('actorMovies'), 
        self.timelineVisKeys
    );

    self.displayData = [];
    self.initVis();
};


TimeLineVis.prototype.initVis = function () {

    var self = this; 

    var margin = {top: 30, right: 10, bottom: 10, left: 140},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    self.dimensions = self.setDimensions(height);

    x = d3.scale.ordinal()
    y = {};

    var x = d3.time.scale()
        .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
        .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.years)
    .tickSize(16, 0)
    .tickFormat(d3.time.format("%B"));

   var axis = d3.svg.axis().orient("left");
   var background;
   var foreground;

    self.svg = self.parentElement.select("svg");

    var width = 960,
        height = 500;

    // filter, aggregate, modify data
    // self.wrangleData(null);

    // call the update method
    // self.updateVis();


};

// Keys to use:   decade --> size bars based on number of films
//                       --> Shade baded on average rating?
//                 Individual years ->  Size on releases?

// Probably  won't need these

TimeLineVis.prototype.wrangleData = function (_filterFunction) {
    var self = this;
    
    // displayData should hold the data which is visualized
    self.displayData = self.filterAndAggregate(_filterFunction);
};


TimeLineVis.prototype.updateVis = function () {
    var self = this;
};



TimeLineVis.prototype.onSelectionChange = function (selectionStart, selectionEnd) {
    var self = this;
    
    self.wrangleData(function (data) {
        return (data.time <= selectionEnd && data.time >= selectionStart);
    });

    self.updateVis();
};



TimeLineVis.prototype.filterAndAggregate = function (_filter) {
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