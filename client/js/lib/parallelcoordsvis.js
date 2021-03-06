// code compiled from 
// http://bl.ocks.org/syntagmatic/4020926
// http://bl.ocks.org/jasondavies/1341281
// http://bl.ocks.org/mbostock/1341021
// http://bl.ocks.org/mostaphaRoudsari/b4e090bb50146d88aec4
// http://bl.ocks.org/mbostock/1087001


ParallelCoordVis = function(_parentElement, _session) {
    var self = this;
    self.parallelCoordKeys = [
        // 'Rated',
        // 'Runtime', // minutes
        'BoxOffice',
        // 'Director',
        'Title',
        'Year',
        'imdbRating',
        'tomatoRating',
        'tomatoUserRating'
    ]

    self.parentElement = _parentElement;

    self.selectedData = false;

    self.data = filterData(
        _session.get('actorMovies'), 
        self.parallelCoordKeys
    );

    self.displayData = [];
    self.initVis();
};


ParallelCoordVis.prototype.initVis = function () {

    var self = this; 

    div = self.parentElement.append("div")
        .attr("class", "tooltip-pc")
        .style("display", "none");

    // find the longest text size in the first row to adjust left margin
    // need to make this better ...
    var textLength = 0;
    self.data.forEach(function(d){
        if (d.Title.length > textLength) {
            textLength = d.Title.length;
        }
    });

    var margin = {top: 30, right: 30, bottom: 10, left: 150 + textLength},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    self.dimensions = self.setDimensions(height);

    // var x = d3.scale.ordinal().rangePoints([0, width], 1);
    var x = d3.scale.ordinal()
    var y = {};

    
    var dragging = {};

    var line = d3.svg.line()
        // .defined(function(d) { return !isNaN(d[1]); });
    var axis = d3.svg.axis().orient("left");
    var background;
    self.foreground;

    self.svg = self.parentElement.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // area is set up, now lets make the vis from data

    x.domain(dimensions = self.dimensions.map(function(d) {
        if (d.type !== 'string') {
            y[d.name] = d.scale.domain(d.extent).range(d.range);
        } else {
            y[d.name] = d.scale.rangePoints([0, height]);
        }
        return d.name;
    }))
    .rangePoints([0, width]);    


    self.dimensions.forEach(function(dimension) {
        dimension.scale.domain(dimension.type === "number"
        ? dimension.extent
        : self.data.map(function(d) { 
            return d[dimension.name]; 
        }).sort());
    });

    // Add grey background lines for context.
    background = self.svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(self.data)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = self.svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(self.data)
        .enter().append("path")
        .attr("d", path)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove);

    // Add a group element for each dimension.
    var g = self.svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) {
            return "translate(" + x(d) + ")"; 
        })
        .call(d3.behavior.drag()
            .origin(function(d) { return {x: x(d)}; })
            .on("dragstart", function(d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) {
                    return position(a) - position(b); 
                });                
                x.domain(dimensions);
                g.attr("transform", function(d) { 
                    return "translate(" + position(d) + ")"; 
                })
            })
            .on("dragend", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr(
                    "transform", "translate(" + x(d) + ")"
                );
                
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            })
        );

    // Add an axis and title.
    g.append("g")
        .attr("class", function(d) {
            if (d === 'Title') {
                return 'axis-string';
            }
            return "axis";
        })
        .each(function(d) {
            // d3.select(this).call(axis.scale(y[d]));
            var cdimen = checkDimension(d)
            // format the ticks to not have commas
            if (cdimen.type === 'string') {
                d3.select(this).call(axis.scale(
                    cdimen.scale
                    ).tickSize(4)
                );
            } else {
                d3.select(this).call(axis.scale(
                    cdimen.scale
                    ).tickFormat(d3.format('d'))
                );  
            }
        })
        .append("text")
        .style("text-anchor", "middle")
        .attr("id", "pc-axis-label")
        .attr("y", -9)
        .text(function(d) { return d; });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
            var cdimen = checkDimension(d);
            d3.select(this).call(
                cdimen.brush = d3.svg.brush()
                    .y(y[d])
                    .on("brushstart", brushstart)
                    .on("brush", brush));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    // filter, aggregate, modify data
    // self.wrangleData(null);

    // call the update method
    // self.updateVis();

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
      return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    function brush() {
        var actives = self.dimensions.filter(function(p) { 
            return !p.brush.empty(); 
        });
        var extents = actives.map(function(p) { 
            return p.brush.extent(); 
        });
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                if (p.type === 'string') {
                    console.log(d, p, y[p.name](d[p.name]))
                    return (extents[i][0] <= y[p.name](d[p.name]) && 
                        y[p.name](d[p.name]) <= extents[i][1]); 
                } else {
                    return (extents[i][0] <= d[p.name] && 
                        d[p.name] <= extents[i][1]);
                }
            }) ? null : "none";
        });
    }

    function checkDimension(d) {
        var cdimen; 
        self.dimensions.forEach(function(dim) {
            if (dim.name === d) {
                cdimen = dim;
            }
        })
        return cdimen
    }

    function mousemove(d) {
        var movie = dimensions.map(function(p) { return [d[p]][0]; })
        div.text(movie[0])
            .style("left", (d3.event.pageX - 34) + "px")
            .style("top", (d3.event.pageY - 12) + "px");
    }

    function mouseover() {
        div.style("display", "inline");
        var line = d3.select(this);
        line.moveToFront();
        line
            .style("stroke", 'black')
            .style("stroke-width", 4)
    }

    function mouseout() {
        div.style("display", "none");
        var line = d3.select(this);
        line
            .style('stroke', 'steelblue')
            .style("stroke-width", 2)
    }

};

ParallelCoordVis.prototype.setDimensions = function(height) {

    var self = this;

    var dimensions = [
        {
            name: "Title",
            scale: d3.scale.ordinal(),
            type: "string",

        },
        // {
        //     name: "Director",
        //     scale: d3.scale.ordinal(),
        //     type: "string",

        // },
        {
            name: "imdbRating",
            scale: d3.scale.linear(),
            extent: [0,10],
            type: "number",
            range : [height, 0],
        },
        {
            name: "tomatoRating",
            scale: d3.scale.linear(),
            extent: [0,10],
            type: "number",
            range : [height, 0],
        },
        {
            name: "tomatoUserRating",
            scale: d3.scale.linear(),
            extent: [0, 5],
            type: "number",
            range : [height, 0],
        },
        {
            name: "BoxOffice",
            scale: d3.scale.log(),
            extent: [0.01, d3.max(self.data, function(p) {
                return +p['BoxOffice'];
            })],
            type: "number",
            range : [height, 0]
        },
        {
            name: "Year",
            scale: d3.scale.linear(),
            extent: d3.extent(self.data, function(p) {
                        return +p['Year'];
                    }),
            type: "number",
            range : [height, 0]
        },
    ];

    return dimensions;
}

ParallelCoordVis.prototype.wrangleData = function (_filterFunction) {
    var self = this;

    // displayData should hold the data which is visualized
    self.displayData = self.filterAndAggregate(_filterFunction);
};


ParallelCoordVis.prototype.updateVis = function (d) {
    var self = this;
    self.foreground.data([d]).enter()
    // self.foreground.exit().remove()

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



// https://gist.github.com/trtg/3922684

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};