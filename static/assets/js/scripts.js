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
			$('.overlay').append('<div class="overlay-content selected"><div class="controls"><strong>Details</strong><button type="button" data-function="close">close</button></div><div class="overlay-body">'+content+'</div></div>');
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

var controls = {
	navigation : function() {
		$('button[data-function="prev"]').on('click', function() {
			controls.showPrev();
		});
		$('button[data-function="next"]').on('click', function() {
			controls.showNext();
		});
		$('.controls')
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
	syncAnchors : function() {
		var current = $('.rail section.selected').attr('id');
		$('.controls ol li').removeClass('selected').children('a[href="#'+ current +'"]').parent('li').addClass('selected');
	},
	showPrev : function() {
		var current = $('section.selected'),
			prev = current.prev();

		prev.fadeIn('fast');
		if (prev.prev().length === 0) {
			$('button[data-function="prev"]').attr('disabled','disabled');
		} else {
			$('button[data-function="prev"], button[data-function="next"]').removeAttr('disabled');
		}
		current.hide().removeClass('selected').prev().addClass('selected');
		controls.syncAnchors();
	},
	showNext : function() {
		var current = $('section.selected'),
			next = current.next();

		next.fadeIn('fast');
		if (next.next().length === 0) {
			$('button[data-function="next"]').attr('disabled','disabled');
		} else {
			$('button[data-function="prev"], button[data-function="next"]').removeAttr('disabled');
		}
		current.hide().removeClass('selected').next().addClass('selected');
		controls.syncAnchors();
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
controls.navigation();
controls.toggleButtons();
// controls.syncAnchors();
})();