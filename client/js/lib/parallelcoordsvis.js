ParallelCoordVis = function(_parentElement, _session) {
    var self = this;
    self.parallelCoordKeys = [
        'BoxOffice',
        // 'Director',
        // 'Rated',
        // 'Runtime', // minutes
        // 'Title',
        'Year',
        'imdbRating',
        'tomatoRating',
        'tomatoUserRating'
    ]

    self.parentElement = _parentElement;


    self.data = nanToZero(
        _session.get('actorMovies'), 
        self.parallelCoordKeys
    );

    self.displayData = [];
    self.initVis();
};


ParallelCoordVis.prototype.initVis = function () {

    var self = this; 

    self.svg = self.parentElement.select("svg");

    var width = 960;
    var height = 500;

    var margin = {top: 30, right: 10, bottom: 10, left: 10},
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;


    var x = d3.scale.ordinal().rangePoints([0, width], 1);
    var y = {};
    var dragging = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    self.svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // area is set up, now lets make the vis from data
    
    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = self.parallelCoordKeys.filter(function(d) {
        return d != "BoxOffice" && (y[d] = d3.scale.linear()
            .domain(d3.extent(self.data, function(p) {
                return +p[d];
                })
            )
            .range([height, 0])
        )
    }));

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
        .attr("d", path);

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
        .attr("class", "axis")
        .each(function(d) { 
            d3.select(this).call(axis.scale(y[d])); 
        })
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(
                y[d].brush = d3.svg.brush()
                    .y(y[d]).on("brushstart", brushstart).on("brush", brush));
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
        return line(dimensions.map(function(p) { 
            return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
      var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
          extents = actives.map(function(p) { return y[p].brush.extent(); });
      foreground.style("display", function(d) {
        return actives.every(function(p, i) {
          return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        }) ? null : "none";
      });
    }


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