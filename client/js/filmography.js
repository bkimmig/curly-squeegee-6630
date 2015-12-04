// Abandoned for now, focusing development on timelinevis.js



// // the height and width of the actual drawing area
// var height = 400;
// var width = 750;
// var padding = 25; 	// add padding on all sides

// var data = [1,2,3];

// var timeline = d3.selectAll("#timelineVis")
// 		.data(data);

// var filmCircles = timeline.selectAll("circle");

// 	filmCircles.enter().append("circle")
// 			.classed("circles", true);
// 	filmCircles.exit().remove();


// // now we do something with the incoming selection
//     filmCircles.attr("cx", function(d,i) {
//     			return i*90 + 50
//     		})
//         .attr("cy", function (d, i) {
//                 return i * 90 + 50
//             })
//         .attr("r", function (d, i) {
//                 return d;
//             })
//         .style("fill", "steelblue")


// 	timeline.append("svg")

// svg.attr({
//     width: width + 2 * padding,
//     height: height + 2 * padding
// })


// // a rectangle in the background
// svg.append("rect")
//         .attr({
//             width: width,
//             height: height,
//             style: "stroke: none; fill: #aaeeee",
//             transform: "translate(" + padding + "," + padding + ")"
//         });
