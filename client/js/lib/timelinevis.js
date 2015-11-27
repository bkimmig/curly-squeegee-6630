// maybe we could do a grid of moves and their genres? 
// like a matrix
// http://codepen.io/bishopsmove/pen/AlHmc


TimeLineVis = function(_parentElement, _session) {
    var self = this;

    self.parentElement = _parentElement;

    self.data = _session.get('actorMovies');
    self.displayData = [];
    self.initVis();
};


TimeLineVis.prototype.initVis = function () {

    var self = this; 

    self.svg = self.parentElement.select("svg");

    var width = 960,
        height = 500;

    // filter, aggregate, modify data
    // self.wrangleData(null);

    // call the update method
    // self.updateVis();


};

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