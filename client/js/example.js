prep_persona_data = function(weeks, persona_table) {
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    var plot_data = [];
    var dates = [];
    for(i=0; i<persona_table[0].emailCount.length; i++){
        plot_data.push(
            {
                persona: persona_table[0].persona,
                count: persona_table[0].emailCount[i], 
                xval:i, 
                begin: weeks[i].start,
                end: weeks[i].end,
                date: parseDate(weeks[i].start)
            }
        );
        dates.push(parseDate(weeks[i].start));
    };
    return [plot_data, dates];
};

prepPersonaPlotData = function(weekData, personaData) {
    var parseDate = d3.time.format("%Y-%m-%d").parse;
    var data = personaData[0];
    
    var plotData = [];
    var dates = [];
    var i;
    for (i=0; i<data.emailCount.length; i++) {
        plotData.push({
            persona: data.persona,
            count: data.emailCount[i],
            xval: i,
            begin: weekData[i].start,
            end: weekData[i].end,
            date: parseDate(weekData[i].start),
            url: data.url[i],
            title: data.email[i]
        });
        
        dates.push(parseDate(weekData[i].start));
    };

    return [plotData, dates];
};


formatToolTip = function(d) {
    var titleString = '';
    if (d.title != null) {
        d.title.forEach(function(t){
            titleString += (
                "<span style='color:#000'>" + 
                t + "</span>" + " <br> ");
        });
    }

    var returnString = (
        "<strong>Persona:</strong> <span style='color:red'>" + 
        d.persona + 
        "</span>" +
        "<br>" +
        d.begin + " - " + d.end +
        "<br>" +
        titleString);
    return returnString;

}


persona_plot = function(data, dates) {
    
    // set the margin
    var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var width = 600 - margin.left - margin.right;
    var height = 270 - margin.top - margin.bottom;

    var mindate = dates[0];
    var maxdate = dates[dates.length-1];

    // var x = d3.scale.linear().range([0, width]);
    var x = d3.time.scale()
        .domain([mindate, maxdate])
        .range([0, width-10]);    
    
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(3)
        .tickFormat(d3.time.format("%Y-%m-%d"))
        .tickValues(dates); // explicitly set the tick values

    // var xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("bottom")
    //     .ticks(3);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(3);

    // Define the div for the tooltip
    var div = d3.select("body").append("div")   
        .attr("class", "tooltip-persona")               
        .style("opacity", 0);

    // var tip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([-10, 0])
    //     .html(function(d) {
    //         var titleString = '';
    //         if (d.title != null) {
    //             d.title.forEach(function(t){
    //                 titleString += (t + "<br>");
    //             });
    //         }
            
    //         var returnString = (
    //             "<strong>Persona:</strong> <span style='color:red'>" + 
    //             d.persona + 
    //             "</span>" +
    //             "<br>" +
    //             d.begin + " - " + d.end +
    //             "<br>" +
    //             titleString);
    //         return returnString;
    //   });


    // define the points
    var pointValues = d3.svg.line()
        .x(function(d) {return x(d.date)})
        .y(function(d) {return y(d.count)});

    // Adds the svg canvas
    var svg = d3.select("#persona-plot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");


    // Scale the range of the data
    // x.domain(d3.extent(data, function(d) { return d.xval; }));
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // svg.call(tip);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "circle")
        .attr("d", pointValues(data));

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5.5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.count); })
        .style('fill', function(d) { // current week is a green dot.
            date = d.begin;
            if (date === moment().startOf('isoWeek').format("YYYY-MM-DD")) {
                color = "#25A01C";
            } else{
                color = "black";
            }
            return color;
        })
        // .on('mouseover', tip.show)
        // .on('mouseout', tip.hide);
        .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div.html(formatToolTip(d))  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
    .append('text')
        .attr("transform", "rotate(0)")
        .attr("y", 6)
        .attr("x", width-10)
        .attr("dx", ".71em")
        .attr("dy", "-1em")        
        .style("text-anchor", "end")
        .text("Date");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append('text')
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("N Emails");
};

