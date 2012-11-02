(function() {
	'use strict';

/*****************************************************************************
Get JSON
*****************************************************************************/
var data = $.getJSON("assets/js/whoswho.json"),
	obj,
	allFirst = [],
	allLast = [],
	allCompanies = [],
	allProfAssociations = [],
	allCivicAffiliations = [],
	allUndergraduate = [],
	allGraduate = [],
	allHometown = [],
	allState = [],
	allData = [];

$(document).ajaxComplete(function() {
	obj = $.parseJSON(data.responseText);

	// scrape all values and push into specified array
	function pushData(data, id, arrayName) {
		if (data[0] !== undefined && data[0].length > 1) {
			$.each(data, function(i, id) {
				// check if value already exists
				if ($.inArray(id, arrayName) === -1) {
					arrayName.push(id);
				} else {
					//do nothing
				}
			});
		} else {
			if ($.inArray(data, arrayName) === -1) {
				arrayName.push(data);
			} else {
				//do nothing
			}
		}
	}


	$.each(obj.whoswho, function(i, whoswho) {
		var first,
			last,
			profAssociations,
			civicAffiliations,
			undergraduate,
			graduate,
			degree,
			hometown,
			state,
			person = '<li><div class="photo"><img src="assets/im/media/' + whoswho.img + '" height="100" width="83" alt="id" /></div>'+
					'<h2><span>'+ whoswho.first + ' ' + whoswho.middle + ' </span>' + whoswho.last +'</h2>'+
					'<dl><dt>Primary Company</dt><dd>'+ whoswho.primaryCo +'</dd>'+
					'<dt>Secondary Company</dt><dd>'+ whoswho.secondaryCo +'</dd>'+
					'<dt>Industry</dt><dd>'+ whoswho.industry +'</dd>'+
					'<dt>Undergraduate College</dt><dd>'+ whoswho.undergraduate +'</dd>'+
					'<dt>Graduate College</dt><dd>'+ whoswho.graduate +'</dd>'+
					'<dt>Home Town</dt><dd>'+ whoswho.hometown +', '+ whoswho.state +'</dd>'+
					'<dt>Professional Associations</dt><dd>'+ whoswho.profAssociations +'</dd>'+
					'<dt>Civic Affiliations</dt><dd>'+ whoswho.civicAffiliations +'</dd>'+
					'<dt>Biography</dt><dd><a href="'+ whoswho.url +'" target="_blank">Click here</a></dd></dl></li>';

		// populate Who's Who Details
		$('#all-whos-who ul').append(person);

		// push data into array
		pushData(whoswho.first, first, allFirst);
		pushData(whoswho.last, last, allLast);
		pushData(whoswho.profAssociations, profAssociations, allProfAssociations);
		pushData(whoswho.civicAffiliations, civicAffiliations, allCivicAffiliations);
		pushData(whoswho.undergraduate, undergraduate, allUndergraduate);
		pushData(whoswho.graduate, graduate, allGraduate);
		pushData(whoswho.hometown, hometown, allHometown);
		pushData(whoswho.state, state, allState);
	});

	// build industry list
	$.each(obj.industries, function(i, industries) {
		var html = '<option value="'+industries+'">'+industries+'</option>';
		$('.industry-list').append(html);
	});

	// build companies list
	$.each(obj.companies, function(i, companies) {
		allCompanies.push(companies);
	});

	// apply array into auto-complete
	$( ".autocomplete-prof-assoc" ).autocomplete({
		appendTo: '.overlay-main',
		source: allProfAssociations
	});
	$( ".autocomplete-civic-affil" ).autocomplete({
		appendTo: '.overlay-main',
		source: allCivicAffiliations
	});
	$( ".autocomplete-undergraduate" ).autocomplete({
		appendTo: '.overlay-main',
		source: allUndergraduate
	});
	$( ".autocomplete-graduate" ).autocomplete({
		appendTo: '.overlay-main',
		source: allGraduate
	});
	$( ".autocomplete-hometown" ).autocomplete({
		appendTo: '.overlay-main',
		source: allHometown
	});
	$( ".autocomplete-state" ).autocomplete({
		appendTo: '.overlay-main',
		source: allState
	});
	$( ".autocomplete-company" ).autocomplete({
		appendTo: '.overlay-main',
		source: allCompanies
	});

	var allData = allProfAssociations.concat(
		allFirst,
		allLast,
		allCivicAffiliations,
		allUndergraduate,
		allGraduate,
		allHometown,
		allState);

	$( "#whos-who-search" ).autocomplete({
		source: allData
	});
});


/*****************************************************************************
Transition Grid In
*****************************************************************************/
$('#all-whos-who').ajaxComplete(function() {
	$(this).fadeIn(1000).slideDown(900);
});

/*****************************************************************************
Overlay
*****************************************************************************/
var overlayWrap = $('.overlay'),
	overlay = {
	details : function() {
		$('#whos-who').on('click', 'li', function() {
			var $this = $(this),
				content = $this.html(),
				details = '<div id="overlay-whos-who-details" class="overlay-item selected">'
						+ '<div class="controls"><strong>Details</strong><button type="button" data-function="remove">close</button></div>'
						+ '<div class="content">'+content+'</div>'
						+ '</div>';
			$('.overlay-main').append(details);
			overlay.launchItem('overlay-whos-who-details');
		});
	},
	hideItem : function() {
		overlayWrap.on('click', 'button[data-function="close"], .controls button[data-function="remove"]', function() {
			var hideOverlay = overlayWrap.fadeOut('fast').parents('body').removeClass('no-scroll'),
				dataFunc = $(this).attr('data-function');

			if (dataFunc === 'remove') {
				$('#overlay-whos-who-details').remove();
				hideOverlay;
			} else {
				hideOverlay;
			}
		});
	},
	getName : function() {
		$('body').on('click', '[data-function^="overlay"]', function(e) {
			overlay.launchItem($(this).attr('data-function'));
			e.preventDefault();
		});
	},
	launchItem : function(itemName) {
		if (overlayWrap.not(':visible')) {
			overlayWrap.fadeIn('fast').parents('body').addClass('no-scroll');
		} else {
			// do nothing
		}

		$('#' + itemName).siblings().removeClass('selected');
		overlayWrap.find('#' + itemName).addClass('selected');
	}
}

/*****************************************************************************
Questionnaire
*****************************************************************************/
var questionnaire = {
	addEntry : function() {
		function applyEntry($this) {
			var container = $this.parents('section'),
				entry = container.find('input[type="text"]'),
				newEntry = $(document.createElement('li')),
				buttonRemove = $(document.createElement('button')).attr('type','button').attr('data-function','remove').text('remove');

			if (entry.val()) {			
				if (container.find('.entries').length === 0) {
					$(document.createElement('ul')).appendTo(container).addClass('entries');
				} else {
					//do nothing
				}
				$(newEntry).prependTo(container.find('.entries')).text(entry.val()).append(buttonRemove);
				container.children('.notification').remove();
				entry.val('');
			} else {
				var notification = $(document.createElement('div')).addClass('notification');
				if (container.find('.notification').length === 0) {
					container.children('.multi').after(notification.text('Please enter a value'));
				} else {
					//do nothing
				}
			}
		}

		$('#questions .multi').on('click', 'button[data-function="add"]', function() {
			applyEntry($(this));
		});

		$('#questions .multi').on('keydown', 'input[type="text"]', function() {
			if ( event.which == 13 ) {
				applyEntry($(this));
			}
		});
	},
	removeEntry : function() {
		$('#questions').on('click','button[data-function="remove"]',function() {
			var $this = $(this),
				entries = $this.parents('.entries');
			$(this).parent('li').remove();
			if (entries.children().length === 0) {
				entries.remove();
			} else {
				//do nothing
			}
		})
	}
}

/*****************************************************************************
Questionnaire Navigation
*****************************************************************************/
var current,
	navigation = {
	getCurrent : function() {
		return current = $('section.selected');
	},
	nextPrev : function() {
		$('button[data-function="prev"]').on('click', function() {
			navigation.showPrev();
		});
		$('button[data-function="next"]').on('click', function() {
			navigation.showNext();
		});
	},
	dots : function() {
		$('.controls ol').on('click', 'a', function(event) {
			var $this = $(this),
				id = $this.attr('href');
			navigation.getCurrent().hide().removeClass('selected').siblings(id).fadeIn('fast').addClass('selected');
			navigation.syncHeader();
			event.preventDefault();
		});
	},
	toggleButtons : function() {
		if ($('.rail section.selected:first-of-type')) {
			$('button[data-function="next"]').show();
		} else if ($('.rail section.selected:last-of-type')) {
			$('button[data-function="prev"]').show();
		} else {
			$('button[data-function="prev"], .next').show();
		}
	},
	syncHeader : function() {
		var selected = 'a[href="#'+ navigation.getCurrent().attr('id') +'"]',
			newTitle = $('a[href="#'+ navigation.getCurrent().attr('id') +'"]').text();
		$('.controls ol li').removeClass('selected').children(selected).parent('li').addClass('selected');
		$('#overlay-survey .controls strong').text(newTitle);
	},
	showPrev : function() {
		var prev = navigation.getCurrent().prev();

		prev.fadeIn('fast');
		navigation.getCurrent().hide().removeClass('selected').prev().addClass('selected');
		navigation.syncHeader();
	},
	showNext : function() {
		var next = navigation.getCurrent().next();

		next.fadeIn('fast');
		navigation.getCurrent().hide().removeClass('selected').next().addClass('selected');
		navigation.syncHeader();
	},
	disableButton : function() {
		if (prev.prev().length === 0) {
			$('button[data-function="prev"]').attr('disabled','disabled');
		} else {
			$('button[data-function="prev"]').removeAttr('disabled');
		}

		if (next.next().length === 0) {
			$('button[data-function="next"]').attr('disabled','disabled');
		} else {
			$('button[data-function="next"]').removeAttr('disabled');
		}
	}
}

var search = {
	getValue : function() {
		$('.search').on('keydown', 'input[type="text"]', function() {
			var searchValue = $('.search input').val().toLowerCase();

			if ( event.which === 13 ) {
				$(".ui-autocomplete").hide();
				search.getResults(searchValue);
			}
		});
	},
	getResults : function(searchValue) {
		var results = [];

		$('#all-whos-who ul').html('');
		$.each(obj.whoswho, function(i, wwdetails) {
		    $.each(wwdetails, function(property, value) {

		    	function test(value) {		    		
					if ($.type(value) ==='string' && value.toLowerCase().indexOf(searchValue) !== -1) {
						if ($.inArray(i, results) === -1) {
							results.push(i);
							var person = '<li><div class="photo"><img src="assets/im/media/' + wwdetails.img + '" height="100" width="83" alt="id" /></div>'+
									'<h2><span>'+ wwdetails.first + ' ' + wwdetails.middle + ' </span>' + wwdetails.last +'</h2>'+
									'<dl><dt>Primary Company</dt><dd>'+ wwdetails.primaryCo +'</dd>'+
									'<dt>Secondary Company</dt><dd>'+ wwdetails.secondaryCo +'</dd>'+
									'<dt>Industry</dt><dd>'+ wwdetails.industry +'</dd>'+
									'<dt>Undergraduate College</dt><dd>'+ wwdetails.undergraduate +'</dd>'+
									'<dt>Graduate College</dt><dd>'+ wwdetails.graduate +'</dd>'+
									'<dt>Home Town</dt><dd>'+ wwdetails.hometown +', '+ wwdetails.state +'</dd>'+
									'<dt>Professional Associations</dt><dd>'+ wwdetails.profAssociations +'</dd>'+
									'<dt>Civic Affiliations</dt><dd>'+ wwdetails.civicAffiliations +'</dd>'+
									'<dt>Biography</dt><dd><a href="'+ wwdetails.url +'" target="_blank">Click here</a></dd></dl></li>';

							// populate Who's Who Details
							$('#all-whos-who ul').append(person);
						} else {
							//do nothing
						}
					} else {
						// console.log(searchValue + "-" + value);
					}
		    	}


		    	if (value[0] !== undefined && value[0].length > 1) {
		    		// console.log(value.length);
		    		$.each(value, function(i, value) {
		    			test(value);
		    		});
		    	} else {
			    	test(value);
		    	}
			});
		});
	}
}

/*****************************************************************************
Initialize
*****************************************************************************/
// overlay.launchItem('overlay-intro'); // launch intro
overlay.details();
overlay.getName();
overlay.hideItem();

questionnaire.addEntry();
questionnaire.removeEntry();

navigation.getCurrent();
navigation.nextPrev();
navigation.toggleButtons();
// controls.syncAnchors();

search.getValue();
})();