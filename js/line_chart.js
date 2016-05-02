function line_chart(data){
	var margin = { top: 10, right: 10, bottom: 30, left: 40 },
		width = 540 - margin.left - margin.right,
		height = 440 - margin.top - margin.bottom;
		
	var svg=dimple.newSvg('.line_chart',540,420);
	var myChart=new dimple.chart(svg,data);
	myChart.setBounds(50, 20, 400, 350);
	var x = myChart.addTimeAxis('x', 'YEAR','%Y','%Y');
	myChart.addMeasureAxis('y', 'VISA APPROVED');	
	x.addOrderRule('Year');
	var line=myChart.addSeries(null, dimple.plot.line);
	line.lineWeight=3;
	line.lineMarkers=true;
	myChart.draw();
}

// stack bar//
function stack_chart(data){
	var margin = {top: 20, right: 50, bottom: 30, left: 70},
		width = 800 - margin.left - margin.right,
		height = 620 - margin.top - margin.bottom,
		padding = 5;

	/*var yGroupMax=d3.max(layer,function(layer){return d3.max(layer,function(d){return d.y;});});*/
	var n=5;
	var visa=Object.keys(data[0]).slice(1);
	
	var stack_data=visa.map(function(v){
		return data.map(function(d){
			return {x:d.DATE,y:+d[v]};
		});
	});
	
	var layout=d3.layout.stack();
	layer=layout(stack_data);
	var yGroupMax=d3.max(layer,function(layer){return d3.max(layer,function(d){return d.y;});});
	var yStackedMax=d3.max(layer,function(d){return d3.max(d,function(d){return d.y+d.y0;});});
// setting up scale
	//stetting up x-scale
	var x =d3.scale.ordinal()
	.domain(layer[0].map(function(d){
		return (d.x);
	})) 
	.rangeRoundBands([0,width],.3);
	// setting up y-scale
	var y=d3.scale.linear()
	.domain([0,
		d3.max(layer,function(d){
			return d3.max(d,function(d){
				return d.y+d.y0;
			});					
		})])
	.range([height,0]);

	// color for the bar
	var colorRange = d3.scale.category10();
	var color = d3.scale.ordinal()
            .range(colorRange.range());
	

	// legend
	var legend = d3.legend.color()
	.shapeWidth(70)
	.orient('vertical')
	.labels(['EMPLOYMENT','TOURIST','BUSINESS','VISITOR','ART SURROGACY','STUDENT'])
	.scale(color);

// Creating Axis
	var xAxis= d3.svg.axis()
	.scale(x)
	.tickSize(10)
	.tickPadding(3)
	.orient('bottom');




	var yAxis=d3.svg.axis()
	.scale(y)
	.tickSize(10)
	.tickPadding(10)	
	.tickFormat(d3.format('s'))
	.orient('left');

// Creat a svg for stacked bar
	var svg=d3.select('.stacked_bar').append('svg')
.attr('width',width + margin.left + margin.right)
.attr('height',height +margin.top+margin.bottom)
.append('g')
.attr('transform','translate('+margin.left+',20)');

	var layer=svg.selectAll('.layer')
.data(layer)
.enter().append('g')
.attr('class','layer')
.style('fill',function(d,i){
	return color(i);});

	var rect=layer.selectAll('rect')
.data(function (d){return d;})
.enter().append('rect')
.attr('x',function(d)
	{	 	return x(d.x);})
.attr('y',height)
.attr('width',101)
.attr('height',0 );
	
	rect.transition()
		.delay(function(d,i){
			return i*10;
		})
.attr('y',function(d){
	return y(d.y0+d.y);})
.attr('height',function(d){
	return y(d.y0)-y(d.y+d.y0) ;});


//drawing axis 
	// xAxis
	svg.append('g')
		.attr('class','x axis' )
		.attr('transform','translate(5,'+height+')' )
		.call(xAxis);
	
	// yAxis
	svg.append('g')
		.attr('class','y axis')
		.attr('transform','translate(15,0)')
		.call(yAxis);

	// legend
	svg.append('g')
		.attr('class','legend_title' ).append('text')
		.attr('transform','translate(50,5)')
		.text('Visa Categories');

	svg.append('g')

		.attr('class','legend')
		.attr('transform','translate(50,15)')
		.call(legend);

	// y-axis label
	svg.append('g').attr('class','y_label' ).append('text')
            .attr('text-anchor', 'middle')  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr('transform', 'translate(-50,'+(height/2)+')rotate(-90)')  // text is drawn off the screen top left, move down and out and rotate
            .text('Visa Approved');

	

	d3.selectAll('input').on('change',change);
	var timeout=setTimeout(function(){
		d3.select('input[value=\'group\']').property('checked',true).each(change);
	},2000);
	function change(){
		clearTimeout(timeout);
		if (this.value==='group')transitionGroup();
		else transitionStacked();
	}
			
	function transitionGroup(){
		y.domain([0,yGroupMax]);
		rect.transition()
			.duration(500)
			.delay(function(d,i){return i*10;})
			.attr('x',function(d,i,j){return x(d.x)+x.rangeBand()/n*j;} )
			.attr('width',x.rangeBand()/n )
			.transition()
			.attr('y',function(d) {return y(d.y);})
			.attr('height',function(d){return height-y(d.y);} )
			;

	}

	function transitionStacked(){
		y.domain([0,yStackedMax]);
		rect.transition()
			.duration(500)
			.delay(function(d,i){return i*10;})
			.attr('y',function(d){return y(d.y0+d.y);} )
			.attr('height',function(d){return y(d.y0)-y(d.y0+d.y); } )
			.transition()
			.attr('x',function(d){return x(d.x);} )
			.attr('width',101);
		
			
	}

		
}

function multi_line(multi_series){
	var svg=dimple.newSvg('.multi_series', 600,520);
	var data=dimple.filterData(multi_series,'COUNTRY',['BANGLADESH','UNITED KINGDOM','USA','GERMANY','SRI LANKA']);
	var myChart= new dimple.chart(svg,data);
	var x = myChart.addCategoryAxis('x', 'YEAR');
	x.addOrderRule('Year');
	myChart.addMeasureAxis('y', 'VISA APPROVED');
	var s = myChart.addSeries('COUNTRY', dimple.plot.line);
	s.lineWeight=3;
	s.lineMarkers=true;
	s.interpolation = 'cardinal';
	myChart.addLegend(60, 10, 500, 20, 'left');
	myChart.draw();

}




var file_loc = ['./data/line_chart.csv','./data/stack_bar_data.csv','./data/line.csv'];



	queue()
	.defer(d3.csv,file_loc[0])
	.defer(d3.csv,file_loc[1])
	.defer(d3.csv,file_loc[2])
	.await(analyze);
function analyze(error,line,stacked,multi_series){
	if (error){ console.log(error);}
	else{
		line_chart(line);
		stack_chart(stacked);
		multi_line(multi_series);		
	}
}

/*
var dataset = [];                        
for (var i = 0; i < 10; i++) {
	var newNumber = i;  
	dataset.push(newNumber);             
}
*/
/*var people=d3.select('body')
	.select('.people')
	.append('g')
	.selectAll('span')
	.data(dataset).enter()
	.append('span')
	.attr('class','glyphicon glyphicon-user');

people.append('br').append('g')
	.selectAll('span')
	.data(dataset).enter()
	.append('span')
	.attr('class','glyphicon glyphicon-user');
/*d3.select('body')
	.select('.people')
	.append('g')
	.selectAll('span')
	.data(dataset).enter()
	.append('span')
	.attr('class','glyphicon glyphicon-user');

for (var j = 0; i < 10; j++) {
	d3.select('body')
	.select('.people')
	.append('g')
	.selectAll('span')
	.data(dataset).enter()
	.append('span')
	.attr('class','glyphicon glyphicon-user');
}*/