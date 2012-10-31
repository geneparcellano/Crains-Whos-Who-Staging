(function() {
	'use strict';

/*****************************************************************************
Get JSON
*****************************************************************************/
var data = $.getJSON("assets/js/whoswho.json"),
	obj,
	allFirst = [],
	allLast = [],
	allProfAssociations = [],
	allCivicAffiliations = [],
	allIndustry = [],
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
			industry,
			undergraduate,
			graduate,
			degree,
			hometown,
			state,
			person = '<li><div class="photo"><img src="assets/im/icon-unknown.gif" height="100" width="83" alt="id" /></div>'+
					'<h2>'+ whoswho.first + ' <span>' + whoswho.middle + ' ' + whoswho.last +'</span></h2>'+
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
		pushData(whoswho.industry, industry, allIndustry);
		pushData(whoswho.undergraduate, undergraduate, allUndergraduate);
		pushData(whoswho.graduate, graduate, allGraduate);
		pushData(whoswho.hometown, hometown, allHometown);
		pushData(whoswho.state, state, allState);
	});

	// apply array into auto-complete
	$( "#survey-prof-assoc" ).autocomplete({
		appendTo: '#questions',
		source: allProfAssociations
	});
	$( "#survey-civic-affil" ).autocomplete({
		appendTo: '#questions',
		source: allCivicAffiliations
	});
	$( "#survey-industry" ).autocomplete({
		appendTo: '#questions',
		source: allIndustry
	});
	$( "#survey-undergraduate" ).autocomplete({
		appendTo: '#questions',
		source: allUndergraduate
	});
	$( "#survey-graduate" ).autocomplete({
		appendTo: '#questions',
		source: allGraduate
	});
	$( "#survey-hometown" ).autocomplete({
		appendTo: '#questions',
		source: allHometown
	});
	$( "#survey-state" ).autocomplete({
		appendTo: '#questions',
		source: allState
	});

	var allData = allProfAssociations.concat(
		allFirst,
		allLast,
		allCivicAffiliations,
		allIndustry,
		allUndergraduate,
		allGraduate,
		allHometown,
		allState);

	console.log(allData);
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
Launch Intro
*****************************************************************************/
// overlay.launchItem('overlay-intro');

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

			if ( event.which == 13 ) {
				console.log(searchValue);
				search.getResults(searchValue);
			}
		});
	},
	getResults : function(searchValue) {
		var info;

		// Populate search results
		function showResults() {
			var deferred = $.Deferred();

			$.each(obj.whoswho, function(i, whoswho) {
				// console.log(obj);
				if (obj.whoswho[0].toLowerCase().indexOf(searchValue) !== -1) {
					console.log(i);
					// var info = '<ul><li class="thumb"><img src="' + icons.location + '" alt="'+ icons.name +'" /></li><li>Name <strong>'+ icons.name +'</strong></li><li>File Size <strong>'+ icons.size +'</strong></li><li>Height <strong>'+ icons.height +'</strong></li><li>Width <strong>'+ icons.width +'</strong></li><li>Location <input type="text" value="'+ icons.location +'" readonly="readonly" /></li><li>Last Modified <strong>'+ icons.modified +'</strong></li></ul>';
					// $('#result').hide().append(info).fadeIn();
					deferred.resolve();
				}
			});

			return deferred.promise();
		}
		showResults().done(function() {
			// Count icons
			// countIcons($('#result').children('ul').length);
		});
	}
}

/*****************************************************************************
Initialize
*****************************************************************************/
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