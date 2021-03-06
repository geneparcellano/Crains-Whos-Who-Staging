(function() {
	'use strict';

/*****************************************************************************
Hide Address Bar For Mobile Devices
*****************************************************************************/
// When ready...
window.addEventListener("load",function() {
  // Set a timeout...
  setTimeout(function(){
    // Hide the address bar!
    window.scrollTo(0, 1);
  }, 0);
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
		$('#whos-who li').on('click', function() {
			var $this = $(this);
			var content = $this.html();
			$('.overlay').append('<div id="whos-who-details" class="overlay-content selected"><div class="controls"><strong>Details</strong><button type="button" data-function="close">close</button></div><div class="overlay-body">'+content+'</div></div>');
			$('.overlay').fadeIn('fast');
		});
	},

	removeOverlay : function() {
		$('body').on('click', '.overlay .controls button[data-function="close"]', function() {
			$('.overlay').fadeOut('fast');
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
	done : function() {
		$('button[data-function="done"]').on('click', function() {
			$('#survey').removeClass('selected').hide().parents('.overlay').fadeOut('fast');
		});
	}
}
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
		$('.controls ol').on('click', 'a', function() {
			var $this = $(this),
				id = $this.attr('href');
			navigation.getCurrent().hide().removeClass('selected').siblings(id).fadeIn('fast').addClass('selected');
			navigation.syncHeader();
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
questionnaire.done();
navigation.getCurrent();
navigation.nextPrev();
navigation.dots();
navigation.toggleButtons();
// controls.syncAnchors();
})();