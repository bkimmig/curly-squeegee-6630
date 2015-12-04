TreeMapVis_ = function(_parentElement, _session) {
    var self = this;

    self.parentElement = _parentElement;

     self.treemapVisKeys = [
        'Title',
        'Released',
        'Year',
        'imdbRating',
        'tomatoRating',
        'tomatoUserRating'
    ]

    //Link movie data to timelineVis 'data'
    self.data = filterData(
        _session.get('actorMovies'), 
        self.treemapVisKeys
    );

    self.treemapData = self.initData();
    self.displayData = [];
    self.initVis();
};


TreeMapVis_.prototype.initVis = function () {

    //copy global data to be visible to this function
    var self = this; 


    //define some canvas variables
    // var width = 960;
    // var height = 500;
    var margin = {top: 30, right: 10, bottom: 20, left: 140},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var color = d3.scale.category20c();

    var treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function(d) { return d.size; });
    

    var div = self.parentElement.append("div")
        .style("position", "relative")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");


    var node = div.datum(self.treemapData).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function(d) { 
            return d.children ? color(d.name) : null; 
        })
        .text(function(d) { return d.children ? null : d.name; })
        .on("mouseover", mouseover);

    d3.selectAll("input").on("change", function change() {
        var value = this.value === "count"
            ? function() { return 1; }
            : function(d) { return d.size; };

        node
            .data(treemap.value(value).nodes)
            .transition()
            .duration(1500)
            .call(position);
    });

    function position() {
        this.style("left", function(d) { 
            return d.x + "px"; 
        })
        .style("top", function(d) { 
            return d.y + "px"; 
        })
        .style("width", function(d) { 
            return Math.max(0, d.dx - 1) + "px"; 
        })
        .style("height", function(d) { 
            return Math.max(0, d.dy - 1) + "px"; 
        });
    }

    function mouseover(d) {
        console.log(d)
    }

}


// TreeMapVis.prototype.initData = function() {
//     var self = this;

//     var i;
//     var treemapData = {
//         "name": "flare",
//         "children": []
//     }

//     var minVotes = d3.min(self.data, function(d) {
//         return d['imdbVotes'];
//     });

//     var allYears = getUniqueYearsList(self.data);

//     console.log(minVotes);
//     // finish setting up the data structure
//     allYears.forEach(function(y) {
//         treemapData['children'].push({ name: y, children: [] })
//     })


//     self.data.forEach(function(d) {
//         var name = d['Year'];
//         var size = (d['imdbVotes'] !== 'N/A') ? d['imdbVotes']: minVotes;
//         for (i=0; i<treemapData.children.length; i++){
//             if (treemapData.children[i].name === name) {
//                 d['name'] = name;
//                 d['size'] = parseFloat(size.replace(',', ''));;
//                 treemapData.children[i]['children'].push(d);
//             } 
//         }
//     })

//     return treemapData;
// }

TreeMapVis_.prototype.initData = function() {
    var self = this;

    var i;
    var treemapData = {
        "name": "coworkers",
        "children": []
    }

    var minVotes = d3.min(self.data, function(d) {
        return d['imdbRating'];
    });

    var newData = getUniqueActorList(self.data);
    allActors = newData[0];
    self.data = newData[1];

    console.log(minVotes);
    // finish setting up the data structure
    allActors.forEach(function(y) {
        treemapData['children'].push({ name: y, children: [] })
    })


    allActors.forEach(function(aName) {
        var tmData = {name: aName, children: []}
        for(i=0; i<self.data.length; i++) {
            var movie = self.data[i];
            if (movie.Actors.indexOf(aName) > -1) {
                movie['size'] = movie.imdbRating;
                movie['name'] = movie.Title;
                tmData.children.push(movie);
            }
        }
        treemapData.children.push(tmData);
    })

    return treemapData;

}


    // self.data.forEach(function(d) {
    //     var name = d['Year'];
    //     var size = (d['imdbRating'] !== 'N/A') ? d['imdbRating']: minVotes;
    //     for (i=0; i<treemapData.children.length; i++){
    //         if (treemapData.children[i].name === name) {
    //             d['name'] = name;
    //             d['size'] = parseFloat(size.replace(',', ''));;
    //             treemapData.children[i]['children'].push(d);
    //         } 
    //     }
    // })

    // return treemapData;



getUniqueActorList = function(movieData) {
    var actors = [];
    for (var i=0; i<movieData.length; i++){
        var movie = movieData[i];
        var actorString = movie.Actors;

        // parse the actor string
        var actorList = actorString.split(',');
        for (var j=0; j<actorList.length; j++) {
            if (actorList[j][0] === " ") {
                actorList[j] = actorList[j].slice(1)
            }
        }

        movie.Actors = actorList;

        // add the unique actors to the list
        for (var j=0; j<actorList.length; j++) {
            if (actors.indexOf(actorList[j]) === -1) {
                actors.push(actorList[j]);
            }
        }

    }
    aData = Session.get('actorData')
    actors.splice( actors.indexOf(aData.name), 1 );
    return [actors, movieData];
}


// TreeMapVis.prototype.initData = function() {
//     var self = this;

//     var i;
//     var treemapData = {
//         "name": "flare",
//         "children": []
//     }

//     var minRating = d3.min(self.data, function(d) {
//         return d['imdbRating'];
//     });

//     var allYears = getUniqueYearsList(self.data);
//     allYears.sort();

//     // finish setting up the data structure
//     allYears.forEach(function(y) {
//         treemapData['children'].push({ name: y, children: [] })
//     })


//     self.data.forEach(function(d) {
//         var name = d.Year;
//         var size = (d.imdbVotes !== 'N/A') ? d.imdbRating: minRating;
//         for (i=0; i<treemapData.children.length; i++){
//             if (treemapData.children[i].name === name) {
//                 d['name'] = name;
//                 d['size'] = size;
//                 treemapData.children[i]['children'].push(d);
//             } 
//         }
//     })

//     return treemapData;

// }
