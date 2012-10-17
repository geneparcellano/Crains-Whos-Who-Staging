(function() {
	'use strict';

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
		$('#whoswho li').on('click', function() {
			var $this = $(this);
			var content = $this.html();
			$('body').append('<div class="overlay"><div class="overlay-bg"></div><div class="overlay-content"><div class="controls"><strong>Details</strong><button type="button" data-function="close">close</button></div><div class="overlay-body">'+content+'</div></div></div>');
			$('.overlay').fadeIn('fast');
		});
	},

	removeOverlay : function() {
		// $('body').on('click', '.overlay-bg, button[data-function="close"]', function() {
		$('body').on('click', '.overlay .controls button[data-function="close"]', function() {
			$('.overlay').fadeOut('fast', function() {
				$('.overlay').remove();
			});
		});
	}
}


/*****************************************************************************
Questionnaire
*****************************************************************************/
var questionnaire = {
	getStarted : function() {
		$('button[data-function="get_started"]').on('click', function() {
			controls.showNext();
			$('#questionnaire .controls').show();
		});
	}
}
var controls = {
	navigation : function() {
		$('button[data-function="prev"]').on('click', function() {
			controls.showPrev();
		});
		$('button[data-function="next"]').on('click', function() {
			controls.showNext();
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
	showPrev : function() {
		var current = $('section.selected'),
			prev = current.prev();

		prev.css('margin-left','800px').show();
		prev.animate({'margin-left' : '0'}, 'fast', function() {
			if (prev.prev().length === 0) {
				$('button[data-function="prev"]').fadeOut('fast');
			} else {
				$('button[data-function="prev"], button[data-function="next"]').fadeIn('fast');
			}
			current.hide().removeClass('selected').prev().addClass('selected');
		});
	},
	showNext : function() {
		var current = $('section.selected'),
			next = current.next();

		current.animate({'margin-left' : '-800px'}, 'fast', function() {
			if (next.next().length === 0) {
				$('button[data-function="next"]').fadeOut('fast');
			} else {
				$('button[data-function="prev"], button[data-function="next"]').fadeIn('fast');
			}
			current.hide().removeClass('selected').next().addClass('selected');
			next.show();
		});
	}
}



/*****************************************************************************
Initialize
*****************************************************************************/
dropDown.show();
dropDown.hide();
overlay.details();
overlay.removeOverlay();
questionnaire.getStarted();
controls.navigation();
controls.toggleButtons();
})();