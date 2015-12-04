// maybe we could do a grid of moves and their genres? 
// like a matrix
// http://codepen.io/bishopsmove/pen/AlHmc


TimeLineVis_ = function(_parentElement, _session, _eventHandler) {

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


TimeLineVis_.prototype.initVis = function () {

    //copy global data to be visible to this function
    var self = this; 

    //add tool tip for mouseover: https://gist.github.com/mstanaland/6100713
    self.div = self.parentElement.append("div")
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

    self.x = d3.time.scale()
        .domain([new Date(minDate), new Date(maxDate)])
        .range([0, width]);

    self.y = d3.scale.linear()
        .domain([0,10])
        .range([height, 0]);

    //Find min and max votes for an actors filmography on IMDB

    var minVotes = d3.min(self.data, function(d) { 
        return d.imdbVotes;
    });

    var maxVotes = d3.max(self.data, function(d) { 
        return d.imdbVotes;
    });
    
    self.xAxis = d3.svg.axis()
        .scale(self.x)
        .orient("bottom")    
        .tickFormat(d3.time.format("%Y"));
        
    self.yAxis = d3.svg.axis()
        .scale(self.y)
        .orient("left")
        .ticks(10)
        .tickSize(-width, 3);

    self.radScale = d3.scale.linear()
        .domain([minVotes, maxVotes])
        .range([3,25]);

    self.circles = self.svg.selectAll(".dot")
            .data(self.data)
        
    self.circles.enter().append("circle")
            
    self.circles.attr("class", "dot")
            .attr("cx", function(d) {
                return self.x(new Date(d.Released)) 
            })
            .attr("r", function(d) { 
                if(d.imdbVotes==="N/A"){
                    return self.radScale(minVotes/2);
                }
                else{
                    return self.radScale(d.imdbVotes); 
                }
            })
            .attr("cy", function(d) { return self.y(d.imdbRating); })
            .classed("dot","true")
            .on("mouseover", function() { self.mouseover(); })
            .on("mouseout", function() { self.mouseout(); })
            .on("mousemove", function(d) { return self.mousemove(d); })
            .on('click', function(d) { return self.clicked(d); });
    
     // Add the X Axis
    self.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(self.xAxis)
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
        .call(self.yAxis)
    .append('text')
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("imdb Rating");

}


TimeLineVis_.prototype.mousemove = function(d) {
    var self = this;

    self.div.html(
        //"<div id=posterID> <a> <img src=" + posterPicture(d)  + "width=100 height=200/> </a> </div>" +
        self.posterPicture(d) +
        "<div id=tooltipID><strong>Title: </strong>" + d.Title + "</div>" +
        "<div id=tooltipID><strong>Plot: </strong> " + d.Plot + "</div> " +
        "<div id=tooltipID> <strong>Director: </strong>" + d.Director + "<br/>" +
        "<strong>Released: </strong>"+ d.Released + "<br/>" +
        "<strong>Rating: </strong>"+ d.imdbRating + "<br/>" +

        "<strong>No. Votes: </strong>"+ d.imdbVotes + "<br/> </div>")
        .style("left", function() {
            var xPos = d3.event.pageX;
            if (xPos > 960/2) {
                return (d3.event.pageX) - 305 + "px";
            }
            return (d3.event.pageX - 30) + "px";
        })     
        .style("top", function() {
            var yPos = d3.event.pageY;
            if (yPos > 500 - 10) {
               return (d3.event.pageY - 300) + "px" 

            }
            return (d3.event.pageY - 100) + "px"
        });    
}


TimeLineVis_.prototype.mouseover = function() {
    var self = this;
    self.div.style("display", "inline");
}

TimeLineVis_.prototype.mouseout = function() {
    var self = this;
    self.div.style("display", "none");
}

TimeLineVis_.prototype.clicked = function(d) {
    var self = this;
    evt = d3.select(d3.event.target);
    
    if (evt.attr('class') === 'dotselectedclick'){
        evt.attr("class", "dot");
        self.eventHandler.selectionChanged([]);
        return;
    }

    var circles = d3.select("#timelineVis")
        .selectAll('circle')
        .attr("class", "dot");

    if (evt.attr('class') === 'dot'){
        evt.attr("class", "dotselectedclick");
    } else {
        evt.attr("class", "dot");
    }

    self.eventHandler.selectionChanged(d);

}

//Display Movie poster if one is available.  Otherwise, display default image
TimeLineVis_.prototype.posterPicture = function(d){
    var self = this;
    if(d.Poster==="N/A"){
        return "<div id=posterID> <a> <img src='/img/NotFound.jpg' width=180 height=101/> </a> </div>";
    }
    else{
        return "<div id=posterID> <a> <img src=" + d.Poster + "width=100 height=200/> </a> </div>";
    }
} // end posterPicture


TimeLineVis_.prototype.updateVis = function (d) {
    var self = this;

    self.selection = self.svg.selectAll(".dotselected")
            .data(d)

    self.selection.enter().append("circle")

    self.selection.attr("class", "dotselected")
            .attr("cx", function(d) {
                return self.x(new Date(d.Released)) 
            })
            .attr("r", function(d) { 
                if(d.imdbVotes==="N/A"){
                    return self.radScale(minVotes/2);
                }
                else{
                    return self.radScale(d.imdbVotes); 
                }
            })
            .attr("cy", function(d) { return self.y(d.imdbRating); })
            // .classed("dot","true")
            .on("mouseover", function() { self.mouseover(); })
            .on("mouseout", function() { self.mouseout(); })
            .on("mousemove", function(d) { return self.mousemove(d); })
            .on('click', function(d) { return self.clicked(d); })
            .moveToFront();
    
    self.selection.exit().remove();
    
};







