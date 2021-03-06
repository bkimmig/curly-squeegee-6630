// maybe we could do a grid of moves and their genres? 
// like a matrix
// http://codepen.io/bishopsmove/pen/AlHmc


TimeLineVis = function(_parentElement, _session, _eventHandler) {

    //copy global data to be visible to this function
    var self = this;

     self.timelineVisKeys = [
        'Title',
        'Released',
        'Year',
        'imdbRating',
        'tomatoRating',
        'tomatoUserRating',
        'imdbVotes',
        'tomatoUserRating',
        'BoxOffice'
    ]

    self.parentElement = _parentElement;
    self.eventHandler = _eventHandler;
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
    div = self.parentElement.append("div")
        .attr("class", "tooltip-tl")
        .style("display", "none");

    //define some canvas variables
    var margin = {top: 30, right: 20, bottom: 20, left: 15},
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

    var minVotes = d3.min(self.data, function(d) { 
        return d.imdbVotes;
    });

    var maxVotes = d3.max(self.data, function(d) { 
        return d.imdbVotes;
    });
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")    
        .tickFormat(d3.time.format("%Y"));
        
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10)
        .tickSize(-width, 3);

    var radScale = d3.scale.linear()
        .domain([minVotes, maxVotes])
        .range([3,25]);

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
            .on("mousemove", mousemove)
            .on('click', click);

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

        div.html(
            //"<div id=posterID> <a> <img src=" + posterPicture(d)  + "width=100 height=200/> </a> </div>" +
            posterPicture(d) +
            "<div id=tooltipID><strong>Title: </strong>" + d.Title + "</div>" +
            "<div id=tooltipID><strong>Plot: </strong> " + d.Plot + "</div> " +
            "<div id=tooltipID> <strong>Director: </strong>" + d.Director + "<br/>" +
            "<strong>Released: </strong>"+ d.Released + "<br/>" +
            "<strong>Rating: </strong>"+ d.imdbRating + "<br/>" +

            "<strong>No. Votes: </strong>"+ d.imdbVotes + "<br/> </div>")
            .style("left", function() {
                var xPos = d3.event.pageX;
                if (xPos > width/2) {
                    return (d3.event.pageX) - 305 + "px";
                }
                return (d3.event.pageX - 30) + "px";
            })     
            .style("top", function() {
                var yPos = d3.event.pageY;
                if (yPos > height - 10) {
                   return (d3.event.pageY - 300) + "px" 

                }
                return (d3.event.pageY - 100) + "px"
            });    
       
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

    function click(d) {
        
        evt = d3.select(d3.event.target);
        
        if (evt.attr('class') === 'dotselected'){
            evt.attr("class", "dot");
            self.eventHandler.selectionChanged([]);
            return;
        }

        var circles = d3.select("#timelineVis")
            .selectAll('circle')
            .attr("class", "dot");

        if (evt.attr('class') === 'dot'){
            evt.attr("class", "dotselected");
        } else {
            evt.attr("class", "dot");
        }

        self.eventHandler.selectionChanged(d);

    }

    //Display Movie poster if one is available.  Otherwise, display default image
    function posterPicture(d){
        if(d.Poster==="N/A"){
            return "<div id=posterID> <a> <img src='/img/NotFound.jpg' width=180 height=101/> </a> </div>";
        }
        else{
            return "<div id=posterID> <a> <img src=" + d.Poster  + "width=100 height=200/> </a> </div>";
        }
    } // end posterPicture
}



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