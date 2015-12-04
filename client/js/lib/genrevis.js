// maybe we could do a grid of moves and their genres? 
// like a matrix
// http://codepen.io/bishopsmove/pen/AlHmc


GenreVis = function(_parentElement, _session) {
    var self = this;

    self.parentElement = _parentElement;

    self.data = _session.get('actorMovies');
    self.displayData = [];
    self.initNodeData();
    self.initVis();
};


GenreVis.prototype.initVis = function () {
// Connect movies by genre
// http://jsfiddle.net/zhanghuancs/a2QpA/
    var self = this; 

    self.svg = self.parentElement.select("svg");

    var width = 960,
        height = 500;

    var color = d3.scale.category20();
    
    var extent = d3.extent(self.nodeData, function(d) {
            // console.log(d.count)
            return d.count;
        })
    circleSize = d3.scale.linear()
        .domain(extent)
        .range([10, 40]);

    var force = d3.layout.force()
        .charge(10)
        // .charge(function(d, i) { return i ? 0 : -2000; })
        .gravity(0.05)
        // .linkDistance(50)
        .size([width, height]);

    self.svg
        .attr("width", width)
        .attr("height", height)

    force
        .nodes(self.nodeData)
        .start();

    var nodeEnter = self.svg.selectAll(".node")
        .data(self.nodeData)
        .enter()

    var nodeG = nodeEnter.append('g')

    var nodes = nodeG
        .append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return circleSize(d.count) })
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    nodes.append("title")
        .text(function(d) { return d.genre; })

    nodeG.append('text')
        .attr("x", function(d) {return d.x })
        .attr("y", function(d) {return d.y })
        .attr("text-anchor", "middle")
        .text(function(d) {
            if(circleSize(d.count) > extent[1]/2) {
                // console.log(circleSize(d.count), d.genre) 
                return d.genre;
            }
            return "";
    })
    // force.on("tick", function() {
    //     node.attr("cx", function(d) { return d.x; })
    //         .attr("cy", function(d) { return d.y; });
    // });

    force.on("tick", function(e) {
        var q = d3.geom.quadtree(self.nodeData);
        var i = 0;
        var n = self.nodeData.length;

        while (++i < n) { 
            q.visit(collide(self.nodeData[i]))
        };

        self.svg.selectAll("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });


    function collide(node) {
        var r = circleSize(node.radius) + 5,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
        return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = circleSize(node.radius) + circleSize(quad.point.radius);
                
                if (l < r) {
                    l = (l - r) / l * .5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }


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
            group: i,
            radius: genres[genreKeys[i]]
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


