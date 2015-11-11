// function GenreVis (_parentElement, _session) {
//     var self = this;

//     self.parentElement = _parentElement;

//     self.data = _session.get('actorMovies');
//     self.displayData = [];
//     // self.initVis();
// }

GenreVis = function(_session) {
    var self = this;

    // self.parentElement = _parentElement;

    self.data = _session.get('actorMovies');
    self.displayData = [];
    // self.initVis();
    self.initNodeData();
};


GenreVis.prototype.initVis = function () {
    var self = this; 
    console.log('blah');
    // self.svg = self.parentElement.select("svg");

    // filter, aggregate, modify data
    self.wrangleData(null);

    // call the update method
    self.updateVis();
};


GenreVis.prototype.initNodeData = function() {
    var self = this;

    // get all the genres for the movie
    var genres = {};
    for (i=0; i<self.data.length; i++){
        var movie = self.data[i].Genre;
        var g = movie.split(',');
        for (j=0; j<g.length; j++) {
            if (genres[g[j]]) {
                genres[g[j]] += 1;
            } else {
                genres[g[j]] = 1;
            }
        }
    }

    // put them in node form
    var genre_keys = Object.keys(genres);
    var node_genres = [];
    for (i=0; i<genre_keys.length; i++){
        node_genres.push({
            genre: genre_keys[i],
            count: genres[genre_keys[i]],
            group: i
        });
    }

    self.nodeData = node_genres;
}



GenreVis.prototype.wrangleData = function (_filterFunction) {
    var self = this;
    
    // displayData should hold the data which is visualized
    self.displayData = self.filterAndAggregate(_filterFunction);
};


GenreVis.prototype.updateVis = function () {


    var self = this;

    // update the scales :
    var minMaxY = [0, d3.max(self.displayData)];
    self.yScale.domain(minMaxY);
    self.yAxis.scale(self.yScale);

    // draw the scales :
    self.visG.select(".yAxis").call(self.yAxis);
    
    // draw the bars :
    var bars = self.visG.selectAll(".bar").data(self.displayData);
    bars.exit().remove();
    bars.enter().append("rect")
        .attr({
            "class": "bar",
            "width": self.xScale.rangeBand(),
            "x": function (d, i) {
                return self.xScale(i);
            }
        }).style({
            "fill": function (d, i) {
                return self.metaData.priorities[i]["item-color"];
            }
        });

    bars.attr({
        "height": function (d) {
            return self.graphH - self.yScale(d) - 1;
        },
        "y": function (d) {
            return self.yScale(d);
        }
    });
};



GenreVis.prototype.onSelectionChange = function (selectionStart, selectionEnd) {
    var self = this;
    
    self.wrangleData(function (data) {
        return (data.time <= selectionEnd && data.time >= selectionStart);
    });

    self.updateVis();
};



GenreVis.prototype.filterAndAggregate = function (_filter) {
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


