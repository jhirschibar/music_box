var margin = {top: 100, right: 20, bottom: 50, left: 40},
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var xScale = d3.scaleLinear()
    .range([0, width]);

var yScale = d3.scaleLinear()
    .range([height, 0]);

var svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

function updateGraph(){d3.json("/getMyJson").then(function(data){
    data.forEach(function(d){
        d.artist= d.artist;
        d.song= d.song_name;
        d.popularity= d.popularity;
        d.danceability= d.danceability;
        d.energy= d.energy;
        d.key= d.key;
        d.loudness= d.loudness;
        d.mode= d.mode;
        d.speechiness= d.speechiness;
        d.acousticness= d.acousticness;
        d.instrumentalness= d.instrumentalness;
        d.liveness= d.liveness;
        d.valence= d.valence;
        d.tempo= d.tempo;
        d.pca1= +d.pca1;
        d.pca2= +d.pca2;
});
    
   
var seedSong = data[0]['song'];
var artist = data[0]['artist'];

recs = data.slice(1, 21);

songList = [];
for (i in recs) songList.push(recs[i]["song"]);

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

// Add the tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-30, 0])
    .html(d => `<strong>Song: </strong><span class='details'>${d.song}<br></span>
    <strong>Artist: </strong><span class='details'>${d.artist}<br></span>`)

// Add the tooltip
var tip2 = d3.tip()
    .attr('class', 'd3-tip')
    .offset([150, 0])
    .html(d => `<strong>Popularity: </strong><span class='details'>${d.popularity}</span>
        <strong>&nbsp;&emsp;&emsp;Danceability: </strong><span class='details'>${d.danceability}</span>
        <strong>&emsp;&emsp;&emsp;Energy: </strong><span class='details'>${d.energy}<br></span>
        <strong>Key: </strong><span class='details'>${d.key}</span>
        <strong>&nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;Loudness: </strong><span class='details'>${d.loudness}</span>
        <strong>&emsp;&emsp;&emsp;&emsp;&emsp;Speechiness: </strong><span class='details'>${d.speechiness}<br></span>
        <strong>Acousticness: </strong><span class='details'>${d.acousticness}</span>
        <strong>&emsp;Instrumentalness: </strong><span class='details'>${d.instrumentalness}</span>
        <strong>&emsp;Liveness: </strong><span class='details'>${d.liveness}<br></span>
        <strong>Valence: </strong><span class='details'>${d.valence}</span>
        <strong>&nbsp;&nbsp;&emsp;&emsp;&emsp;Tempo: </strong><span class='details'>${d.tempo}</span>
        <strong>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Lyrical Valence: </strong><span class='details'>TEMP<br></span>`);

// Add the points!
svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", function(d) {return xScale(d.pca1);})
    .attr("cy", function(d) {return yScale(d.pca2);})
    .attr("r",4)
    .attr("fill", function(d) {if (d.song == seedSong){return "#01665e"}
        if (songList.includes(d.song)) {return "#8c510a"}
        else {return "#c7eae5"}})
    .attr("r", function(d) {if (d.song == seedSong){return 12}
        if (songList.includes(d.song)) {return 6}
        else {return 4}})
    .call(tip)
    .call(tip2)
    .on('mouseover',function(d){
        tip.show(d);
        tip2.show(d);
        })
    .on('mouseout', function(d){
        tip.hide(d);
        tip2.hide(d);
        })

//add seed song legend
svg.append("circle")
    .attr("cx",20)
    .attr("cy",20)
    .attr("r", 12)
    .style("fill", "#01665e")
    .append("text")
    .attr("dx", function(d){return -20})
    .text("Seed Song")

svg.append("text")
    .attr("x", 37)
    .attr("y", 22)
    .text("Seed Song")
    .style("font-size", "15px")
    .attr("alignment-baseline","middle");

//add rec songs legend
svg.append("circle")
    .attr("cx",20)
    .attr("cy",50)
    .attr("r", 6)
    .style("fill", "#8c510a");

//add similarity notation legend
svg.append("text")
    .attr("x", 22)
    .attr("y", 490)
    .text("+  Song has higher value")
    .style("font-size", "15px")
    .attr("alignment-baseline","middle");

svg.append("text")
    .attr("x", 250)
    .attr("y", 490)
    .text("=  Song has a similar value")
    .style("font-size", "15px")
    .attr("alignment-baseline","middle");

svg.append("text")
    .attr("x", 472)
    .attr("y", 490)
    .text("-  Song has a lower value")
    .style("font-size", "15px")
    .attr("alignment-baseline","middle");


svg.append("text")
    .attr("x", 37)
    .attr("y", 52)
    .text("Recommended Songs")
    .style("font-size", "15px")
    .attr("alignment-baseline","middle");

// add title
svg.append("text")
    .attr("x", width/2)
    .attr("y", -40)
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .text("What Songs are Similar to "+seedSong+" by "+artist+"?");
});};

/* d3.select('#refresh').on("click", function() {
    d3.selectAll("svg > *").remove();
    }); */

    function remove(){
        d3.selectAll("svg").remove();
    }


updateGraph();

    