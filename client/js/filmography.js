
// the height and width of the actual drawing area
var height = 400;
var width = 750;
// add padding on all sides
var padding = 25;
var timeline = d3.selectAll("#timelineVis");
var timelineSelection = timeline.selectAll("circle");

var data = [1,2,3];

var data = timelineSelection.data(data)

// now we do something with the incoming selection
    data.attr("cx", function(d,i) {
    			return i*90 + 50
    		})
        .attr("cy", function (d, i) {
                return i * 90 + 50
            })
        .attr("r", function (d, i) {
                return d;
            })
        .style("fill", "steelblue")


	timeline.append("svg")

svg.attr({
    width: width + 2 * padding,
    height: height + 2 * padding
})


// a rectangle in the background
svg.append("rect")
        .attr({
            width: width,
            height: height,
            style: "stroke: none; fill: #aaeeee",
            transform: "translate(" + padding + "," + padding + ")"
        });
