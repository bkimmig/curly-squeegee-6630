// maybe we could do a grid of moves and their genres? 
// like a matrix
// http://codepen.io/bishopsmove/pen/AlHmc


TimeLineVis = function(_parentElement, _session) {
    var self = this;

     self.timelineVisKeys = [
        'Title',
        'Released',
        'Year',
        'imdbRating',
        'tomatoRating',
        'tomatoUserRating'
    ]

    self.parentElement = _parentElement;

    //Link movie data to timelineVis 'data'
    self.data = filterData(
        _session.get('actorMovies'), 
        self.timelineVisKeys
    );

    self.displayData = [];
    self.initVis();
};


TimeLineVis.prototype.initVis = function () {

    //copy global data to be visible to this function
    var self = this; 


    //add tool tip for mouseover: https://gist.github.com/mstanaland/6100713
     var div = self.parentElement.append("div")
        .attr("class", "tooltip-tl")
        .style("display", "none");

 

        // div.append("rect")
        //   .attr("width", 20)
        //   .attr("height", 20)
        //   .attr("fill", "white")
        //   .style("opacity", 0.5);

        // div.append("text")
        //   .attr("x", 15)
        //   .attr("dy", "1.2em")
        //   .style("text-anchor", "middle")
        //   .attr("font-size", "12px")
        //   .attr("font-weight", "bold");
    //define some canvas variables

    var margin = {top: 30, right: 10, bottom: 20, left: 140},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    //Create canvas
    self.svg = self.parentElement.append("svg")
            .attr("width", width +margin.left + margin.right)
            .attr("height", height +margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");


    //set X-axis bounds
    var minDate = d3.min(self.data, function(d){return d.Year;});
    var maxDate = d3.max(self.data, function(d){return d.Year;});
    maxDate = (+maxDate + 1).toString();
    x = d3.time.scale()
        .domain([new Date(minDate), new Date(maxDate)])
        .range([0, width]);
    // x.domain(d3.extent(self.data, function(d) { return new Date(d.Year; }));

    var y = d3.scale.linear()
        .domain([0,10])
        .range([height, 0]);

    //Find min and max votes for an actors filmography on IMDB
    var minVotes = d3.min(self.data, function(d){return d.imdbVotes;});

    var maxVotes = d3.max(self.data, function(d){
        if(d.imdbVotes==="N/A"){
            return minVotes/2;
        }
        else{
            return d.imdbVotes;
        }
    });

    console.log(minVotes, maxVotes)

    var radScale = d3.scale.ordinal()
        .domain([minVotes, maxVotes])
        .rangeRoundBands([3,15]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%Y"))

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10)


    //var rectWidth = width/(2*self.data.length);

    self.svg.selectAll(".dot")
          .data(self.data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("cx", function(d) {
                return x(new Date(d.Released)) 
          })
          .attr("r", function(d) { 
                if(d.imdbVotes==="N/A"){
                    return radScale(minVotes/2);
                }
                else{
                    return radScale(d.imdbVotes)    
                }
            })
          .attr("cy", function(d) { return y(d.imdbRating); })
          .style("fill", "steelblue")
          .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove);

    // var rects = self.svg.selectAll("g")
    //     .data(self.data)
    //     .enter()
    //     .append("g")
    //     .attr("transform", function(d,i){ return "translate(" + i*rectWidth + ", 0)" });
    
    // rects.append("rect")
    //     .attr("x", function(d) {
    //         return x(new Date(d.Released).getFullYear()) 
    //     })
    //     .attr("y", 0 )
    //     .attr('date', function(d) {
    //         return new Date(d.Released).getFullYear()})
    //     .attr("height",function(d){return y(d.imdbRating);})
    //     .attr("width", rectWidth)
    //     .style("fill", "steelblue");

    // rects.transition().duration(500).ease("exp-in-out")
    //     .attr("height", function (d) { return xRange(__Number_of_films_in_timerange__); })
    //     .attr("width", 20);
    

    // rects.exit ()
    //     .transition().duration(1000).ease("exp-in-out")
    //     .attr("width", 0)
    //     .remove ();

     // Add the X Axis
    self.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    .append('text')
        .attr("transform", "rotate(0)")
        .attr("y", 27)
        .attr("x", width+2)
        .attr("dx", ".71em")
        .attr("dy", "-1em")        
        .style("text-anchor", "end")
        .text("Date");

    // Add the Y Axis
    self.svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append('text')
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("imdb Rating");
        //setTimeout (update, 2000)

    function mousemove(d) {
        var movie = "movie"//dimensions.map(function(p) { return [d[p]][0]; })
        div.text("Title: " + d.Title)
                .style("left", (d3.event.pageX - 40) + "px")
                .style("top", (d3.event.pageY - 35) + "px")
            .text("Imdb Rating: " + d.imdbRating)
                .style("left", (d3.event.pageX - 30) + "px")
                .style("top", (d3.event.pageY - 35) + "px")
            .text("IMDB Votes: " + d.imdbVotes)
                .style("left", (d3.event.pageX - 60) + "px")
                .style("top", (d3.event.pageY - 75) + "px");
    }

    function mouseover() {
      div.style("display", "inline");
    }

    function mouseout() {
        div.style("display", "none");
    }
}
    //==================================================
    //      Pseudo code for bar chart creation
    //==================================================
    // 1) read in actorMovies 
    //         var startDate = d3.min(actorMovies[i].year)
    //         var endDate = d3.max(actorMovies[i].year)
    //         var lowYear = Math.floor(startDate/10)*10;
    //         var highYear Math.ceil(endDate/10)*10;

    //         var binWidth = 5; //  years per bin
    //         var nBins = (highYear - lowYear)/binWidth;  // number of rectangles on the graph

    // 2) Define an array of size 'nBins' to record the number of movies are in each bin range
    //     var nMovies[nbins] = {}

    //     for i = 1; i<=nBins; i++
    //         for j = 0; j <=actorMovies.length; j++
    //         if actorMovies[j].year >= (lowYear + (i-1)*binWidth)&& actorMovies[j].year < (lowYear + i*binWidth)
    //             nMovies[i-1] +=1;
            
    // 3) Create a bar chart with ordinal data -- have 'nBins' number of rectangles, each with [scaled] height equal to the number of movies in the
    //     bin --> 'nMovies[i]' for each i=1,2,3...nBins.
    //     - rect height based on yScale (nMovies[i])
    //     - make the spacing between the bars reasonable.  scalable?

    // 4) when user clicks on a bar, rescale to a new barchart with 'binWidth' number of ticks in x

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

// TimeLineVis.prototype.getDateRange = function(actorMovies) {
//     var self = this;

//     self.minDate = d3.min(data, function(d) { return d.year;} );
//     self.maxDate = d3.max(data, function(d) { return d.year;} ); 
// };