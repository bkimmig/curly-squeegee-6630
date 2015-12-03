// maybe we could do a grid of moves and their genres? 
// like a matrix
// http://codepen.io/bishopsmove/pen/AlHmc


TimeLineVis = function(_parentElement, _session) {

    //copy global data to be visible to this function
    var self = this;

     self.timelineVisKeys = [
        'Title',
        'Released',
        'Year',
        'imdbRating',
        'tomatoRating',
        'tomatoUserRating',
        'imdbVotes'
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

    var x = d3.time.scale()
        .domain([new Date(minDate), new Date(maxDate)])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0,10])
        .range([height, 0]);

    //Find min and max votes for an actors filmography on IMDB



    minVotes = d3.min(self.data, function(d) { 
        return d.imdbVotes;
    });

    maxVotes = d3.max(self.data, function(d) { 
        return d.imdbVotes;
    });

    console.log("Min Votes: ",minVotes);
    console.log("Max Votes: ", maxVotes)

   
 

    // d3.scale.ordinal()
    //     .domain([minVotes, maxVotes])
    //     .rangePoints([3,15]);

 // console.log(100,radScale(100))
 // console.log(5000,radScale(5000))
 // console.log(50000, radScale(50000))
 // console.log(60000,radScale(60000))
 // console.log(100000, radScale(100000))
 
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")    
        .tickFormat(d3.time.format("%Y"));
        
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10)
        .tickSize(-width, 3);

     radScale = d3.scale.linear()
        .domain([minVotes, maxVotes])
        .range([3,25]);

        // console.log("movine votes: ", self.data[13].imdbVotes)
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
                    //console.log("not working")
                }
                else{
                    return radScale(d.imdbVotes); 
                }
            })
            .attr("cy", function(d) { return y(d.imdbRating); })
            .classed("dot","true")
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove);

    //self.svg.call(tip);
    
     // Add the X Axis
    self.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    .append('text')
        .attr("transform", "rotate(0)")
        .attr("y", 0)
        .attr("x", width-10)
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


    function mousemove(d) {
        div .html("<div id=posterID> <a> <img src=" + d.Poster + "width = 100 height=200/> </a> </div>" +
            "<div id=tooltipID><strong>Title: </strong>" + d.Title + "</div>" +
            "<div id=tooltipID><strong>Plot: </strong> " + d.Plot + "</div> " +
             "<strong>Director: </strong>" + d.Director + "<br/>" +
            "<strong>Released: </strong>"+ d.Released + "<br/>" +
            "<strong>Rating: </strong>"+ d.imdbRating + "<br/>" +
            "<strong>No. Votes: </strong>"+ d.imdbVotes + "<br/>")
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 68) + "px");    
        //div.text("Title: " + d.Title)
          //      .style("left", (d3.event.pageX - 40) + "px")
            //    .style("top", (d3.event.pageY - 35) + "px");
            // .text("Imdb Rating: " + d.imdbRating)
            //     .style("left", (d3.event.pageX - 30) + "px")
            //     .style("top", (d3.event.pageY - 35) + "px")
            // .text("IMDB Votes: " + d.imdbVotes)
            //     .style("left", (d3.event.pageX - 60) + "px")
            //     .style("top", (d3.event.pageY - 75) + "px");
    }

    function mouseover() {
        // div.transition()        
        //     .duration(500)      
        //     .style("opacity", .9);
      div.style("display", "inline");
    }

    function mouseout() {
        div.style("display", "none");
    }
}
  
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