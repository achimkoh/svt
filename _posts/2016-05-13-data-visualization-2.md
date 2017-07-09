---
layout: post
title:  Data visualization of instagram images by users
slug:   datavis-instagram
date:   2016-05-13 
tags: 	["project", "data visualization"]
---
<style type="text/css">
	#container{
		width:100%;
		height:720px;
		position:relative;
	}

	#container ul{
		width:100%;
		height:100%;
		list-style:none outside none;
		position:absolute;
		overflow:hidden;
		margin-left: 0px;
	}
	  
	#container li:first-child{
		display:list-item;
		position:absolute;
	}

	#container li{
		position:absolute;
		display:none;
		margin-left: 0px;
	}
	
	#container .prevButton{
		height:72px;
		width:68px;
		position:absolute;
		background:url('{{site.baseurl}}/assets/buttons.png') no-repeat;
		top:50%;
		margin-top:-36px;
		cursor:pointer;
		z-index:2000;
		background-position:left top;
		margin-left:0px;
		left:0
	}

	#container .prevButton:hover{background-position:left bottom;left:0;}

	#container .nextButton{
		height:72px;
		width:68px;
		position:absolute;
		background:url('{{site.baseurl}}/assets/buttons.png') no-repeat;
		top:50%;
		margin-top:-36px;
		cursor:pointer;
		z-index:2000;
		background-position:right top;
		right:0
	}

	#container .nextButton:hover{background-position:right bottom;right:0;}

</style>

the assignment was make something similar to [phototrails.net](http://phototrails.net) with an instagram dataset of st.petersburg. The visualizations show users that are most active in terms of numbers of photo and how much they move around in the city. The slideshow at the bottom show each weekday separately. (details to come)

Color represents time of day:
![time]({{ site.baseurl }}/assets/grid.png)

Color represents day of the week:
![weekday]({{ site.baseurl }}/assets/weekday_as_color.png)


<p>
<div id="weekday" align="center">Sunday</div>
</p>
<div id="container">
	<ul>
		<li><img src="{{site.baseurl}}/assets/1sunday.png" width="800px" height="800px" /></li>
		<li><img src="{{site.baseurl}}/assets/2monday.png" width="800px" height="800px" /></li>
		<li><img src="{{site.baseurl}}/assets/3tuesday.png" width="800px" height="800px" /></li>
		<li><img src="{{site.baseurl}}/assets/4wednesday.png" width="800px" height="800px" /></li>
		<li><img src="{{site.baseurl}}/assets/5thursday.png" width="800px" height="800px" /></li>
		<li><img src="{{site.baseurl}}/assets/6friday.png" width="800px" height="800px" /></li>
		<li><img src="{{site.baseurl}}/assets/7saturday.png" width="800px" height="800px" /></li>
	</ul>
	<span class="button prevButton"></span>
	<span class="button nextButton"></span>
</div>	

<script type="text/javascript">
window.onload = function(){
		var pages = $('#container li'), current=0;
		var currentPage,nextPage;

		$('#container .button').click(function(){
			currentPage= pages.eq(current);
			if($(this).hasClass('prevButton'))
			{

				if (current <= 0)
					current=pages.length-1;
				else
					current=current-1;
			}
			else
			{
				if (current >= pages.length-1)
					current=0;
				else
					current=current+1;
			}
			nextPage = pages.eq(current);	
			currentPage.hide();	
			nextPage.show();
			if(current % 7 === 0){document.getElementById("weekday").textContent="Sunday";}
			else if(current % 7 === 1){document.getElementById("weekday").textContent="Monday";}
			else if(current % 7 === 2){document.getElementById("weekday").textContent="Tuesday";}
			else if(current % 7 === 3){document.getElementById("weekday").textContent="Wednesday";}
			else if(current % 7 === 4){document.getElementById("weekday").textContent="Thursday";}
			else if(current % 7 === 5){document.getElementById("weekday").textContent="Friday";}
			else if(current % 7 === 6){document.getElementById("weekday").textContent="Saturday";}
					
		});
};
</script>
