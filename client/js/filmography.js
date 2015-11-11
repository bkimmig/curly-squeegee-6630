 // the height and width of the actual drawing area
    var height = 400;
    var width = 750;
    // add padding on all sides
    var padding = 25;
    var svg = d3.selectAll(".timeline");
    svg.attr({
        width: width + 2 * padding,
        height: height + 2 * padding
    })

    // a rectangle in the background
    svg.append("rect")
            .attr({
                width: width,
                height: height,
                style: "stroke: none; fill: #eeeeee",
                transform: "translate(" + padding + "," + padding + ")"
            });
