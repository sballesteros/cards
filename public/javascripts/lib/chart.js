var d3 = require('d3');

var data = [
  ["1980-01-01",0],
  ["1981-01-01",50],
  ["1982-01-01",100],
  ["1983-01-01",200],
  ["1984-01-01",600],
  ["1985-01-01",1000],
  ["1986-01-01",1300],
  ["1987-01-01",2000],
  ["1988-01-01",2600],
  ["1989-01-01",3700],
  ["1990-01-01",4200],
  ["1991-01-01",5000],
  ["1992-01-01",5700],
  ["1993-01-01",6200],
  ["1994-01-01",6400],
  ["1995-01-01",6500],
  ["1996-01-01",6600],
  ["1997-01-01",6600],
  ["1998-01-01",7000],
  ["1999-01-01",7200],
  ["2000-01-01",7600],
  ["2001-01-01",7900],
  ["2002-01-01",8100],
  ["2003-01-01",8300],
  ["2004-01-01",8400],
  ["2005-01-01",8700],
  ["2006-01-01",8900],
  ["2007-01-01",9000],
  ["2008-01-01",9100],
  ["2009-01-01",9200],
  ["2010-01-01",9300],
  ["2011-01-01",9400],
  ["2012-01-01",9450],
  ["2012-07-01",9450],
  ["2013-08-01",9500],
  ["2014-01-01",9510],
  ["2015-01-01",9490],
  ["2016-01-01",9500],
  ["2017-01-01",9506],
  ["2018-01-01",9500],
  ["2019-01-01",9554],
  ["2020-01-01",9500],
  ["2021-01-01",9522],
  ["2022-01-01",9500],
  ["2023-01-01",9510],
  ["2024-01-01",9520],
  ["2025-01-01",9500],
  ["2026-01-01",9400],
  ["2027-01-01",9500],
  ["2028-01-01",9500] 
];

console.log(data[34]);
console.log(data[49]);
console.log(data.length, 49-34);

module.exports = function(emitter){
  //viz
  var dataH0 = [];
  var r;
  for (var i=0; i<data.length; i++){
    r = 1000+500*Math.random();
    dataH0.push({
      date: new Date(data[i][0]),
      lower: Math.max(data[i][1] -r, 40*Math.random()),
      mean: data[i][1],
      upper: data[i][1] + r
    });
  }

  var dataH1 = [];
  for (var i=0; i<16; i++){
    dataH1.push({
      date: dataH0[34+i].date,
      lower: dataH0[34+i].lower,
      mean: dataH0[34+i].mean,
      upper: dataH0[34+i].upper
    });
  }
  
  var margin = {top: 20, right: 20, bottom: 20, left: 80}
    , width = 860 - margin.left - margin.right
    , height = 320 - margin.top - margin.bottom;

  // Scales and axes. Note the inverted domain for the y-scale: bigger is up!
  var x = d3.time.scale().range([0, width])
    , y = d3.scale.linear().range([height, 0])
    , xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true)
    , yAxis = d3.svg.axis().scale(y).tickSize(-width).orient("left");


  // An area generator, for the light fill.
  var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.lower); })
    .y1(function(d) { return y(d.upper); });

  // Line generators, for the dark stroke.
  var lines ={};
  ['lower', 'mean', 'upper'].forEach(function(p){
    lines[p] = d3.svg.line()
      .interpolate("monotone")
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d[p]); });
  })

  // Compute the minimum and maximum date, and the maximum price.
  x.domain([dataH0[0].date, dataH0[dataH0.length - 1].date]);
  y.domain([d3.min(dataH0.concat(dataH1), function(d) { return d.lower; }), d3.max(dataH0.concat(dataH1), function(d) { return d.upper; })]).nice();

  // Add an SVG element with the desired dimensions and margin.
  var svg = d3.select(".epy-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add the area path.
  svg.append("path")
    .attr("class", "areaH0")
    .attr("d", area(dataH0));

  var updateH1 = {};

  updateH1.g = svg.append("g")
    .datum(dataH1);
  
  updateH1.area = updateH1.g.append("path")
    .attr("class", "areaH1")
    .attr("d", area);

  // Add the line path.
  for(var p in lines){
    svg.append("path")
      .attr("class", "lineH0 " + p)
      .attr("d", lines[p](dataH0));

    updateH1[p] = updateH1.g.append("path")
      .attr("class", "lineH1 " + p)
      .attr("d", lines[p]);
  }

  // Add the x-axis.
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the y-axis.
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", -50)
    .style("text-anchor", "middle")
    .text("Cases");


  // Add caption
  var pos = document.getElementsByTagName('svg')[0].getBoundingClientRect();
  var div = d3.select('.epy-graph')
    .append('div')
    .attr('class', 'epy-caption')
    .style('position', 'absolute')
    .style('top', (pos.top+ height-height/1.3) + "px")    
    .style('left', (pos.left+width-width/1.9)+ "px");
  
  div.append('p')
    .attr('class', 'tangled')
    .html('<span class="white large">+' + (1000 + Math.round(49*(0+1)))+ ' <sup>&plusmn;' + (30 + Math.round(1.2*(0+1))) + '</sup></span> <br/> Prevented cases in the next <span class="white">15 years</span>');


  //update

  emitter.on('update', function(input, target){

    if(input>0.0){

      for (var i=0; i<16; i++){
        dataH1[i] = {
          date: dataH0[34+i].date,
          lower: dataH0[34+i].lower - (input/100)*i*10 - (input/100)*i*i*20,
          mean: dataH0[34+i].mean - (input/100)*i*10 - (input/100)*i*i*20,
          upper: dataH0[34+i].upper- (input/100)*i*10 - (input/100)*i*i*20
        };
      }

    } else {

      for (var i=0; i<16; i++){
        dataH1[i] = {
          date: dataH0[34+i].date,
          lower: dataH0[34+i].lower,
          mean: dataH0[34+i].mean,
          upper: dataH0[34+i].upper
        };
      }
    }

    d3.select('.tangled').html('<span class="white large">+' + (1000 + Math.round(49*(input+1)))+ ' <sup>&plusmn;' + (30 + Math.round(1.2*(input+1))) + '</sup></span> <br/> Prevented cases in the next <span class="white">15 years</span>');

    updateH1.g.datum(dataH1)
    
    updateH1.area.transition().attr("d", area);
    for(var p in lines){
      updateH1[p].transition().attr("d", lines[p]);
    }

  });
}
