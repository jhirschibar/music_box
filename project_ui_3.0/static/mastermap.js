var margin = {top: 100, right: 20, bottom: 60, left: 20},
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

function homeGraph(){

    
d3.dsv(",", "static/clustered_pca_rick_roll.csv", function(d) {
    return {
        artist: d.artist,
        song: d.song_name,
        popularity: d.popularity,
        danceability: d.danceability,
        energy: d.energy,
        key: d.key,
        loudness: d.loudness,
        speechiness: d.speechiness,
        acousticness: d.acousticness,
        instrumentalness: d.instrumentalness,
        liveness: d.liveness,
        valence: d.valence,
        tempo: d.tempo,
        pca1: +d.pca1,
        pca2: +d.pca2,
    }
    }).then(function(data){

    var seedSong = data[0]['song'];
    var seedArtist = data[0]['artist'];

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
        .attr("cy",360)
        .attr("r", 12)
        .style("fill", "#01665e")
        .append("text")
        .attr("dx", function(d){return -20})
    
    svg.append("text")
        .attr("x", 40)
        .attr("y", 360)
        .text("'" + seedSong + "'")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");

    //add rec songs legend
    svg.append("circle")
        .attr("cx",20)
        .attr("cy",390)
        .attr("r", 6)
        .style("fill", "#8c510a");
    
    svg.append("text")
        .attr("x", 40)
        .attr("y", 390)
        .text("Recommended Songs")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");

    //add similarity notation legend
    svg.append("text")
        .attr("x", 500)
        .attr("y", 355)
        .text("+  Higher value")
        .style("font-size", "12px")
        .attr("alignment-baseline","middle");

    svg.append("text")
        .attr("x", 500)
        .attr("y", 372)
        .text("=  Similar value")
        .style("font-size", "12px")
        .attr("alignment-baseline","middle");

    svg.append("text")
        .attr("x", 500)
        .attr("y", 390)
        .text("- Lower value")
        .style("font-size", "12px")
        .attr("alignment-baseline","middle");

    // add title
    svg.append("text")
        .attr("x", width/2)
        .attr("y", -40)
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("What Songs are Similar to '" + seedSong + "' by " + seedArtist + "?");
    });

}

function updateGraph(){d3.json('/getMyJson').then(function(data){
    data.forEach(function(d){
        d.artist= d.artist;
        d.song= d.song_name;
        d.popularity= d.popularity;
        d.danceability= d.danceability;
        d.energy= d.energy;
        d.key= d.key;
        d.loudness= d.loudness;
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
    var seedArtist = data[0]['artist'];

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
        .attr("cy",360)
        .attr("r", 12)
        .style("fill", "#01665e")
        .append("text")
        .attr("dx", function(d){return -20})
    
    svg.append("text")
        .attr("x", 40)
        .attr("y", 360)
        .text("'" + seedSong + "'")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");

    //add rec songs legend
    svg.append("circle")
        .attr("cx",20)
        .attr("cy",390)
        .attr("r", 6)
        .style("fill", "#8c510a");
    
    svg.append("text")
        .attr("x", 40)
        .attr("y", 390)
        .text("Recommended Songs")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");

    //add similarity notation legend
    svg.append("text")
        .attr("x", 500)
        .attr("y", 355)
        .text("+  Higher value")
        .style("font-size", "12px")
        .attr("alignment-baseline","middle");

    svg.append("text")
        .attr("x", 500)
        .attr("y", 372)
        .text("=  Similar value")
        .style("font-size", "12px")
        .attr("alignment-baseline","middle");

    svg.append("text")
        .attr("x", 500)
        .attr("y", 390)
        .text("- Lower value")
        .style("font-size", "12px")
        .attr("alignment-baseline","middle");

    // add title
    svg.append("text")
        .attr("x", width/2)
        .attr("y", -40)
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("What Songs are Similar to '" + seedSong + "' by " + seedArtist + "?");
});};

/* d3.select('#refresh').on("click", function() {
    d3.selectAll("svg > *").remove();
    }); */

    function remove(){
        var svg = d3.select("svg");
        svg.selectAll("*").remove();
        var elements = document.getElementsByTagName("iframe");

        while (elements.length) {
            elements[0].parentNode.removeChild(elements[0]);
          };
    };



    