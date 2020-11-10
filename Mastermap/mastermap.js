var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var xScale = d3.scaleLinear()
    .range([0, width]);
var yScale = d3.scaleLinear()
    .range([height, 0]);

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

d3.dsv(",", "data/clustered_pca.csv", function(d) {
    return {
        song: d.song_name,
        artist: d.artist,
        pca1: +d.pca1,
        pca2: +d.pca2,
        cluster: d.cluster,
    }
    }).then(function(data){

    var seedSong = data[0]['song']

    var colors = ['#a6611a', '#dfc27d', '#80cdc1', '#018571']
    cluster_color = d3.scaleOrdinal()
        .domain(data.map(d => d.cluster))
        .range(colors)

    // Compute the scales’ domains.
    xScale.domain(d3.extent(data, function(d) { return d.pca1; })).nice();
    yScale.domain(d3.extent(data, function(d) { return d.pca2; })).nice();
    
    const xaxis = d3.axisBottom()
        .scale(xScale);
    
    const yaxis = d3.axisLeft()
        .scale(yScale);

        // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);

        // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yaxis)

    const tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-9, 0])
        .html(d => `<strong>Song: </strong><span class='details'>${d.song}<br></span>
        <strong>Artist: </strong><span class='details'>${d.artist}<br></span>`)

    // Add the points!
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", function(d) {return xScale(d.pca1);})
        .attr("cy", function(d) {return yScale(d.pca2);})
        .attr("r",4)
        .attr("fill", function(d) {if (d.song == seedSong){return "#d01c8b"}
            else {return cluster_color(d.cluster)}})
        .attr("r", function(d) {if (d.song == seedSong){return 12}
            else {return 4}})
        .call(tip)
        .on('mouseover',function(d){
            tip.show(d);
            d3.select(this)
              .style('opacity', 1)
              .style('stroke-width', 3);
          })
          .on('mouseout', function(d){
            tip.hide(d);
            d3.select(this)
              .style('opacity', 0.8)
              .style('stroke-width',0.3);
            })
        .call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.event.transform)
           }))
          .append("g");

    function zoom() {
        svg.select(".x.axis").call(xaxis);
        svg.select(".y.axis").call(yaxis);
        svg.selectAll("polygon")			
            .attr("transform", function(d, i) {
                return "translate("+xScale(d.pca1)+","+yScale(d.pca2)+")";
            })
        }
});