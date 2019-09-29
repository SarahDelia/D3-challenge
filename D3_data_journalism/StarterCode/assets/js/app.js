var svgWidth = 1000;
var svgHeight = 500;
var margin = { top: 75, right: 75, bottom: 75, left: 75 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv").then(function(data) {

    console.log(data);
    data.forEach(function(data) {
        data.smokes = +data.smokes;
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
    });


    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);

    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var scatterCircles = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", data => xLinearScale(data.poverty))
        .attr("cy", data => yLinearScale(data.healthcare))
        .attr("r", "15")
        .attr("fill", "red")
        .attr("opacity", ".5");

    chartGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", data => xLinearScale(data.poverty-0.01))
        .attr("y", data => yLinearScale(data.healthcare-0.22))
        .attr("font-size",10)
        .text(data => data.abbr)
        .attr("class", "scatterText")

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(data) {
            return (`${data.state}<br>Poverty (%): ${data.poverty}<br>Healthcare (%): ${data.healthcare}`);
        });
    
    chartGroup.call(toolTip);

    scatterCircles.on("mouseover", function(data) {
      toolTip.show(data, this);
    })

      .on("mouseout", function(data, i) {
        toolTip.hide(data);
      });
      
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.25}, ${height + margin.top - 20})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
})