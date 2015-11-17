// function GenreVis (_parentElement, _session) {
//     var self = this;

//     self.parentElement = _parentElement;

//     self.data = _session.get('actorMovies');
//     self.displayData = [];
//     // self.initVis();
// }

GenreVis = function(_parentElement, _session) {
    var self = this;

    self.parentElement = _parentElement;

    self.data = _session.get('actorMovies');
    self.displayData = [];
    self.initNodeData();
    self.initVis();
};


GenreVis.prototype.initVis = function () {
    var self = this; 

    self.svg = self.parentElement.select("svg");

    var width = 960,
        height = 500;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(50)
        .alpha(0.4)
        .size([width, height]);

    self.svg
        .attr("width", width)
        .attr("height", height)

    force
        .nodes(self.nodeData)
        .start();

    var node = self.svg.selectAll(".node")
        .data(self.nodeData)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return d.count*5 })
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    node.append("title")
        .text(function(d) { return d.genre; });

    force.on("tick", function() {
        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });

    // filter, aggregate, modify data
    // self.wrangleData(null);

    // call the update method
    // self.updateVis();
};


GenreVis.prototype.initNodeData = function() {
    var self = this;

    // get all the genres for the movie
    var genres = {};
    for (i=0; i<self.data.length; i++){
        var movie = self.data[i].Genre;
        var g = movie.split(',');
        for (j=0; j<g.length; j++) {
            var cGenre = g[j];
            
            // remove white space up front
            if (cGenre[0] === " ") {
                cGenre = cGenre.slice(1);
            }

            // count the genres
            if (genres[cGenre]) {
                genres[cGenre] += 1;
            } else {
                genres[cGenre] = 1;
            }
        }
    }

    // put them in node form
    var genreKeys = Object.keys(genres);
    var nodeGenres = [];
    for (i=0; i<genreKeys.length; i++){
        nodeGenres.push({
            genre: genreKeys[i],
            count: genres[genreKeys[i]],
            group: i
        });
    }

    self.nodeData = nodeGenres;
}


GenreVis.prototype.wrangleData = function (_filterFunction) {
    var self = this;

    // displayData should hold the data which is visualized
    self.displayData = self.filterAndAggregate(_filterFunction);
};


GenreVis.prototype.updateVis = function () {
    var self = this;
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


