(function() {
	'use strict';

/*****************************************************************************
Get JSON
*****************************************************************************/
var data = $.getJSON("assets/js/whoswho.json");

var obj,
	allProfAssociations = [],
	allCivicAffiliations = [],
	allIndustry = [],
	allUndergraduate = [],
	allGraduate = [],
	allHometown = [],
	allState = [];

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

	// push data into array
	$.each(obj.whoswho, function(i, whoswho) {
		var profAssociations, civicAffiliations, industry, undergraduate, graduate, degree, hometown, state;

		var person = '<li><div class="photo"><img src="assets/im/icon-unknown.gif" height="100" width="83" alt="id" /></div>'+
					'<h2>'+ whoswho.first + ' <span>' + whoswho.middle + ' ' + whoswho.last +'</span></h2>'+
					'<dl><dt>Primary Company</dt><dd>'+ whoswho.primaryCo +'</dd>'+
					'<dt>Secondary Company</dt><dd>'+ whoswho.secondaryCo +'</dd>'+
					'<dt>Professional Associations</dt><dd>'+ whoswho.profAssociations +'</dd>'+
					'<dt>Civic Affiliations</dt><dd>'+ whoswho.civicAffilliations +'</dd>'+
					'<dt>Industry</dt><dd>'+ whoswho.industry +'</dd>'+
					'<dt>Undergraduate College</dt><dd>'+ whoswho.undergraduate +'</dd>'+
					'<dt>Graduate College</dt><dd>'+ whoswho.graduate +'</dd>'+
					'<dt>Home Town</dt><dd>'+ whoswho.hometown +' '+ whoswho.state +'</dd>'+
					'<dt>Biography</dt><dd><a href="'+ whoswho.url +'" target="_blank">Click here</a></dd></dl></li>';
		$('#all-whos-who ul').append(person);

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
});

/*****************************************************************************
Transition Grid In
*****************************************************************************/
$('#all-whos-who').ajaxComplete(function() {
	$(this).fadeIn(1000).slideDown(900);
});

/*****************************************************************************
Drop Down Menu
*****************************************************************************/
var dropDown = {
	show : function() {
		$('.dropdown > a').on('click', function(event) {
			event.preventDefault();

			var next = $(this).next();
			if (next.css('display') === 'none') {
				// hide all other menu except 'this'
				$('.dropdown > ul').fadeOut('fast');
				next.fadeIn('fast');
			}
			else {
				next.fadeOut('fast');
			}
			event.stopPropagation();
		});
	},
	hide : function() {
		$('.dropdown > ul a').on('click', function(event) {
			event.preventDefault();
			var $this = $(this),
				firstValue = $this.attr('href').slice(0,1);

			if (firstValue !== '#') {
				window.open($this.attr('href'), '_self');
			}

			$('.dropdown > a + *').fadeOut('fast');
		});

		$(document).on('click', function() {
			$('.dropdown > a + *').fadeOut('fast');
		});
	}
}

/*****************************************************************************
Overlay
*****************************************************************************/
var overlay = {
	details : function() {
		$('#whos-who').on('click', 'li', function() {
			var $this = $(this),
				content = $this.html(),
				details = '<div id="whos-who-details" class="overlay-item selected">'
						+ '<div class="controls"><strong>Details</strong><button type="button" data-function="close">close</button></div>'
						+ '<div class="content">'+content+'</div>'
						+ '</div>';
			$('.overlay-main').append(details);
			$('.overlay').fadeIn('fast')
				.parents('body').addClass('no-scroll');
		});
	},

	removeOverlay : function() {
		$('body').on('click', '.overlay .controls button[data-function="close"]', function() {
			$('#whos-who-details').remove();
			$('.overlay').hide()
				.parents('body').removeClass('no-scroll');
		});
	}
}


/*****************************************************************************
Questionnaire
*****************************************************************************/
var questionnaire = {
	getStarted : function() {
		$('button[data-function="get_started"]').on('click', function() {
			$('#intro').removeClass('selected').next('#survey').fadeIn('fast').addClass('selected');
		});
	},
	addEntry : function() {
		$('#questions .multi').on('click', 'button[data-function="add"]', function() {
			applyEntry($(this));
		});
		$('#questions .multi').on('keydown', 'input[type="text"]', function() {
			if ( event.which == 13 ) {
				applyEntry($(this));
			}
		});

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
	},
	done : function() {
		$('button[data-function="done"]').on('click', function() {
			$('#survey').removeClass('selected').hide().parents('.overlay').fadeOut('fast')
				.parents('body').removeClass('no-scroll');
		});
	}
}

/*****************************************************************************
Questionnaire Navigation
*****************************************************************************/
var current;
var navigation = {
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
		$('#survey .controls strong').text(newTitle);
	},
	showPrev : function() {
		var prev = navigation.getCurrent().prev();

		prev.fadeIn('fast');
		if (prev.prev().length === 0) {
			$('button[data-function="prev"]').attr('disabled','disabled');
		} else {
			$('button[data-function="prev"], button[data-function="next"]').removeAttr('disabled');
		}
		navigation.getCurrent().hide().removeClass('selected').prev().addClass('selected');
		navigation.syncHeader();
	},
	showNext : function() {
		var next = navigation.getCurrent().next();

		next.fadeIn('fast');
		if (next.next().length === 0) {
			$('button[data-function="next"]').attr('disabled','disabled');
		} else {
			$('button[data-function="prev"], button[data-function="next"]').removeAttr('disabled');
		}
		navigation.getCurrent().hide().removeClass('selected').next().addClass('selected');
		navigation.syncHeader();
	}
}



/*****************************************************************************
Initialize
*****************************************************************************/
// dropDown.show();
// dropDown.hide();
overlay.details();
overlay.removeOverlay();

questionnaire.getStarted();
questionnaire.addEntry();
questionnaire.removeEntry();
questionnaire.done();

navigation.getCurrent();
navigation.nextPrev();
// navigation.dots();
navigation.toggleButtons();
// controls.syncAnchors();
})();