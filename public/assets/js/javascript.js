$(document).ready(function(){

	$container = $("section#articles");

	//set up some vars
	limit 		= 25;
	filter		= "*"; //default

	//get current filter and set up dropdown filter menu
	$("li.all").hide();
	$("li.divider").hide();

	if (window.location.hash.length > 1) {
		filter = "." + window.location.hash.substr(1);
		$.cookie('filter', filter, { expires: 365 });
		$("#filter li:not(.all) a").addClass("inactive");
		$("#filter li" + filter).find("a").removeClass("inactive");
	} else if ($.cookie('filter') !== undefined) {

		//deactivate filter items
		filter = $.cookie('filter').split(",");
		$("#filter li:not(.all) a").each(function(){
			if (filter.indexOf("." + $(this).parent().attr("class")) == -1) {
				$(this).addClass("inactive");
			}
		});

		if (filter.length == 1) window.location.hash = filter[0].substr(1);

		//save filter string
		filter = filter.join(",");
	}

	//open in new win
	$("section#articles a").attr("target","_blank");

	//filter
	if ($("#filter a.inactive").size()) {
		$("li.all").show();
		$("li.divider").show();			
	}

	$("#filter a").click(function(e) {

		if ($(this).parent().hasClass("all")) {
			filter = "*";
			$.removeCookie('filter');
			window.location.hash = '';
			$("#filter a.inactive").removeClass("inactive");
		} else {
			if (e.altKey) {
				//option is down, show this one only
				$("#filter a").addClass("inactive");
				$(this).removeClass("inactive");
			} else {
				$(this).toggleClass("inactive");

				//check to make sure there are any still active
				if (!$("#filter a:not(.inactive)").size()) {
					$("#filter a").removeClass("inactive");
				}
			}

			//build filter string
			filter = new Array;
			$("#filter a:not(.inactive)").each(function(){
				filter[filter.length] = "." + $(this).parent().attr("class");
			});
			if (filter.length == 1) {
				window.location.hash = filter[0].substr(1);
			} else if (window.location.hash.length) {
				window.location.hash = "";
			}
			filter = filter.join(",");

			$container.isotope({ filter: filter })

			//save filter to query
			$.cookie('filter', filter, { expires: 365 });

		}

		if ($("#filter a.inactive").size()) {
			$("li.all").show();
			$("li.divider").show();			
		} else {
			$("li.all").hide();
			$("li.divider").hide();			
		}

	});
});

$(window).load(function(){
	//init isotope
	$container.isotope({
		itemSelector: "article",
		layoutMode: "masonry",
		filter: filter
	}).removeClass("loading");
});