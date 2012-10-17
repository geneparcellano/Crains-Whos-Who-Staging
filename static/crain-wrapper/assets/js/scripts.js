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
Carousel
*****************************************************************************/
function toggleButtons() {
	if ($('.rail section.selected:first-of-type')) {
		$('button[data-function="next"]').show();
	} else if ($('.rail section.selected:last-of-type')) {
		$('button[data-function="prev"]').show();
	} else {
		$('button[data-function="prev"], .next').show();
	}
}



function showPrev() {
	$('button[data-function="prev"]').on('click', function() {
		var current = $('section.selected'),
			prev = current.prev();

		prev.show();
		prev.animate({'margin-left' : '0'}, 'fast', function() {
			if (prev.prev().length === 0) {
				$('button[data-function="prev"]').fadeOut('fast');
			} else {
				$('button[data-function="prev"], button[data-function="next"]').fadeIn('fast');
			}
			current.removeClass('selected').hide().prev().addClass('selected');
		});
	});
}



function showNext() {
	$('button[data-function="next"]').on('click', function() {
		var current = $('section.selected'),
			next = current.next();

		next.show();
		current.animate({'margin-left' : '-800px'}, 'fast', function() {
			if (next.next().length === 0) {
				$('button[data-function="next"]').fadeOut('fast');
			} else {
				$('button[data-function="prev"], button[data-function="next"]').fadeIn('fast');
			}
			current.removeClass('selected').hide().next().addClass('selected');
		});
	});
}



/*****************************************************************************
Initialize
*****************************************************************************/
dropDown.show();
dropDown.hide();
overlay.details();
overlay.removeOverlay();
toggleButtons();
showPrev();
showNext();

})();