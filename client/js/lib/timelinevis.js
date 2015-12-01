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

    //Link movie data to timelineVis 'data'
    self.data = nanToZero(
        _session.get('actorMovies'), 
        self.timelineVisKeys
    );

    self.displayData = [];
    self.initVis();
};


TimeLineVis.prototype.initVis = function () {

    //copy global data to be visible to this function
    var self = this; 


    //define some canvas variables
    var width = 960;
    var height = 500;
    var margin = {top: 30, right: 10, bottom: 10, left: 140},
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    //define x, y variables
    var x = d3.time.scale()

    //For axes code: http://12devsofxmas.co.uk/2012/01/data-visualisation/
    var xRange = d3.scale.linear().range ([margin.left, width - margin.right]).domain([0, 300]);
    var yRange = d3.scale.linear().range ([height - margin.top, margin.bottom]).domain([0, 300]);

    var xAxis = d3.svg.axis()       // generate an axis
            .scale(xRange)          // set the range of the axis
            .orient("bottom")       // have the text lables below axis
            .tickSize(5)            // height of the ticks
            .tickSubdivide(true);   // display ticks between text labels
            //.tickFormat(d3.time.format("%B"));
            //.ticks(d3.time.years)
        
    var yAxis = d3.svg.axis()       // generate an axis
            .scale(yRange)          // set the range of the axis
            .tickSize(5)            // width of the ticks
            .orient("left")         // have the text labels on the left hand side
            .tickSubdivide(true);   // display ticks between text labels

    self.dimensions = self.setDimensions(height);
    

   //
   var background;
   var foreground;

    //Add an svg to the timelineVis div in results.html
    self.svg = self.parentElement.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")  //add group tag
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    function update () {
        var rects = self.svg.selectAll("rect").data(randomData(), function (d) { return d.id; });
        rects.enter()
            .insert("svg:rect")
            .attr("height", function (d) { return xRange (__Number_movies_in_bin__) })
            .attr("width", 20)
            .style("fill", "steelblue");

        rects.transition().duration(500).ease("exp-in-out")
            .attr("height", function (d) { return xRange(__Number_of_films_in_timerange__); })
            .attr("width", 20);
        

        rects.exit ()
            .transition().duration(1000).ease("exp-in-out")
            .attr("width", 0)
            .remove ();

        setTimeout (update, 2000)
    } //end function update


//==================================================
//      Pseudo code for bar chart creation
//==================================================
// 1) read in actorMovies 
        // var minDate = d3.min(actorMovies)


// };  // end TimeLineVis.prototype.initVis

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

TimeLineVis.prototype.getDateRange = function(actorMovies) {
    var self = this;

    self.minDate = d3.min(data, function(d) { return d.year;} );
    self.maxDate = d3.max(data, function(d) { return d.year;} ); 
};