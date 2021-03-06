(function() {
	'use strict';

var obj,
	data = $.getJSON("../v1/assets/js/whoswho.json"),
	user = [],
	userConnections = [],
	allWhosWho = [];

/*****************************************************************************
Auto Complete
*****************************************************************************/
function initiateAutoComplete() {

	var allFirst = [],
		allLast = [],
		allCompanies = [],
		allProfAssoc = [],
		allCivicAffil = [],
		allUndergrad = [],
		allGrad = [],
		allCity = [],
		allState = [],
		allData = [];

	/*****************************************************************************
	Array Builder
	*****************************************************************************/
	function pushData(id, newArray) {
		if (id[0] !== undefined && id[0].length > 1) {
			$.each(id, function(i, id) {
				// check if value already exists
				if ($.inArray(id, newArray) === -1) {
					newArray.push(id);
				} else {
					//do nothing
				}
			});
		} else {
			if ($.inArray(id, newArray) === -1) {
				newArray.push(id);
			} else {
				//do nothing
			}
		}
	}

	/*****************************************************************************
	Build Arrays
	*****************************************************************************/
	$.each(obj.whoswho, function(i, whoswho) {
		/*****************************************************************************
		For All Whos Who
		*****************************************************************************/
		pushData(i, allWhosWho);

		/*****************************************************************************
		For Autocomplete feature // pushData(array, id, newArray)
		*****************************************************************************/
		pushData(whoswho.first, allFirst);
		pushData(whoswho.last, allLast);
		pushData(whoswho.profAssoc, allProfAssoc);
		pushData(whoswho.civicAffil, allCivicAffil);
		pushData(whoswho.undergrad, allUndergrad);
		pushData(whoswho.grad, allGrad);
		pushData(whoswho.city, allCity);
		pushData(whoswho.state, allState);
	});
	$.each(obj.companies, function(i, companies) {
		/*****************************************************************************
		For Companies
		*****************************************************************************/
		pushData(companies, allCompanies);
	});

	/*****************************************************************************
	Apply updated array into auto-complete fields
	*****************************************************************************/
	$( ".autocomplete-prof-assoc" ).autocomplete({
		// appendTo: '.overlay-main',
		source: allProfAssoc
	});
	$( ".autocomplete-civic-affil" ).autocomplete({
		// appendTo: '.overlay-main',
		source: allCivicAffil
	});
	$( ".autocomplete-undergraduate" ).autocomplete({
		// appendTo: '.overlay-main',
		source: allUndergrad
	});
	$( ".autocomplete-graduate" ).autocomplete({
		// appendTo: '.overlay-main',
		source: allGrad
	});
	$( ".autocomplete-hometown" ).autocomplete({
		// appendTo: '.overlay-main',
		source: allCity
	});
	$( ".autocomplete-state" ).autocomplete({
		// appendTo: '.overlay-main',
		source: allState
	});
	$( ".autocomplete-company" ).autocomplete({
		// appendTo: '.overlay-main',
		source: allCompanies
	});

	// concat data into one array
	var allData = allProfAssoc.concat(
			allFirst,
			allLast,
			allCompanies,
			allCivicAffil,
			allUndergrad,
			allGrad,
			allCity,
			allState
		);

	$( "#whos-who-search" ).autocomplete({
		source: allData
	});

	// hide autocomplete when user enters custom term
	$('#whos-who-2012').on('keyup', 'input[type="text"]', function (event) {
		if(event.which === 13) {
			$(".ui-autocomplete").hide();
		}
	});
}

/*****************************************************************************
Build User Profile
*****************************************************************************/
function buildUserProfile() {
	var a = ['first', 'last', 'suffix', 'primaryCo', 'industry', 'profAssoc', 'civicAffil', 'undergrad', 'grad'],
		userProfAssoc = [],
		userCivicAffil = [],
		i = 0,
		obj = {},
		survey = $('form'),
		userFirst = survey.find('#survey-first').val(),
		userLast = survey.find('#survey-last').val(),
		userSuffix = survey.find('#survey-suffix').val(),
		userCompany = survey.find('#survey-company').val(),
		userIndustry = survey.find('#survey-industry').val(),
		userUndergrad = survey.find('#survey-undergrad').val(),
		userGrad = survey.find('#survey-grad').val();

	$.each($('#survey-prof-assoc .entries li'), function(i) {
		userProfAssoc.push($(this).text().slice(0, -6));
	});
	$.each($('#survey-civic-affil .entries li'), function(i) {
		userCivicAffil.push($(this).text().slice(0, -6));
	});

	//Set values
	obj[a[0]] = userFirst;
	obj[a[1]] = userLast;
	obj[a[2]] = userSuffix;
	obj[a[3]] = userCompany;
	obj[a[4]] = '';
	obj[a[5]] = userProfAssoc;
	obj[a[6]] = userCivicAffil;
	obj[a[7]] = userUndergrad;
	obj[a[8]] = userGrad;

	//Clear User Profile
	user.length = 0;

	//Update User Profile
	user.push(obj);

	//Update Score
	updateScore();
}

/*****************************************************************************
Show "Your Connections"
*****************************************************************************/
function runFilter() {
	$('input[type="text"], select').blur(function() {
		buildUserProfile();
		loadResults(userConnections, '#all-connections');
		animatePersonIn('#all-connections');
	});
}

/*****************************************************************************
Index User's Connection
*****************************************************************************/
function indexConnection(i) {
	if ($.inArray(i, userConnections) === -1) {
		userConnections.push(i);
	} else {
		//do nothing
	}
}

/*****************************************************************************
Update Score
*****************************************************************************/
function updateScore() {
	var	totalScore = 0,
		totalMatch = 0;

	// Clear previous results
	userConnections.length = 0;

	/*****************************************************************************
	Score matches
	*****************************************************************************/
	function scoreMatches(pName, value, multiplier, i, b) {
		if (pName === 'profAssoc' || pName === 'civicAffil') {
			// Compare value against all of user's entries 
			$.each(user[0][pName], function(b, userValue) {
				if (userValue === value) {
					totalScore += multiplier;
					totalMatch++;
					indexConnection(i);
				}
			});
		} else {
			if (user[0][pName] === value) {
				totalScore += multiplier;
				totalMatch++;
				indexConnection(i);
			} 
		}
	}

	/*****************************************************************************
	Score special connections
	*****************************************************************************/
	function specialConnections() {
		$.each(userConnections, function(i, number) {
			var person = obj.whoswho[number];
			if (person.pwr50 === true) {
				totalScore += 10;
			}

			if (person.last === "Obama") {
				totalScore += 15;
			}
		});
		var finalScore = parseInt(totalScore) + parseInt(totalMatch);

		$('#score').text('final score: ' + finalScore);
		$('#matches').text('total matches: ' + totalMatch);

		totalScore = 0;
	}

	/*****************************************************************************
	Values to be scored
	*****************************************************************************/
	$.each(obj.whoswho, function(i, whoswho) {
		$.each(whoswho, function(property, value) {

			if (value.length !== 0) {
				switch (property) {
					case 'primaryCo':
						scoreMatches(property, value, 4, i);
						break;
					case 'secondaryCo':
						scoreMatches(property, value, 4, i);
						break;
					case 'profAssoc':
						// compare all of CWW's values again's the user's value
						$.each(value, function(b, entries) {
							scoreMatches(property, entries, 3, i, b);
						});
						break;
					case 'civicAffil':
						// compare all of CWW's values again's the user's value
						$.each(value, function(b, entries) {
							scoreMatches(property, entries, 3, i, b);
						});
						break;
					case 'undergrad':
						scoreMatches(property, value, 2, i);
						break;
					case 'grad':
						scoreMatches(property, value, 2, i);
						break;
					default:
						// Do nothing
				}
			}
		});
	});

	// Score special connections (Power 50 & Obama's)
	specialConnections();
}

/*****************************************************************************
Build industry list
*****************************************************************************/
function buildSelectOption() {
	$.each(obj.industries, function(i, industries) {
		var html = '<option value="' + industries + '">' + industries + '</option>';
		$('.industry-list').append(html);
	});
}

/*****************************************************************************
Multiple Entry Fields
*****************************************************************************/
function multipleEntry() {

	/*****************************************************************************
	Apply Entry
	*****************************************************************************/
	function applyEntry($this) {
		var container = $this.parents('.multi'),
			entry = container.find('input[type="text"]'),
			newEntry = $(document.createElement('li')),
			buttonRemove = $(document.createElement('button')).attr('type','button').attr('data-function','remove').text('remove');

		if (entry.val()) {			
			if (container.find('.entries').length === 0) {
				$(document.createElement('ul')).appendTo(container).addClass('entries').insertAfter(container.children('.multi'));
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

	/*****************************************************************************
	Apply entry and update score
	*****************************************************************************/
	$('#questions .multi').on('click', 'button[data-function="add"]', function() {
		applyEntry($(this));
		buildUserProfile();
	});

	$('#questions .multi').on('keydown', 'input[type="text"]', function() {
		if ( event.which == 13 ) {
			applyEntry($(this));
			buildUserProfile();
		}
	});
}

/*****************************************************************************
Remove Entry
*****************************************************************************/
function removeEntry() {
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

/*****************************************************************************
Load Results
*****************************************************************************/
function loadResults(arrayName, resultContainer) {
	var container = $(resultContainer),
		emptyContainer = container.children('li').addClass('old');

	$.each(arrayName, function(i, id) {
		var	person = obj.whoswho[id],
			htmlImage,
			htmlPwr50,
			htmlName,
			htmlPrimaryCo,
			htmlSecondaryCo,
			htmlIndustry,
			htmlUndergrad,
			htmlGrad,
			htmlHometown,
			htmlProfAssoc,
			htmlCivicAffil,
			htmlBio,
			profAssoc,
			civicAffil,
			formattedProfAssoc = [],
			formattedCivicAffil = [];

		function formatData(array, property, newArray) {
			if (array[0] !== undefined && array[0].length > 1) {
				$.each(array, function(i, property) {
					newArray.push(' ' + property);
				});
			} else {
				// do nothing
			}
		}

		// Power 50
		if (person.pwr50) {
			htmlPwr50 = '<div class="pwr50">Power 50</div>';
		} else {
			htmlPwr50 = '';
		}

		// Primary Company
		if (person.primaryCo) {
			htmlPrimaryCo = '<dl><dt>Primary Company</dt><dd>'+ person.primaryCo +'</dd>';
		} else {
			htmlPrimaryCo = '<dl><dt>Primary Company</dt><dd>--</dd>'
		}

		// Secondary Company
		if (person.secondaryCo) {
			htmlSecondaryCo = '<dt>Secondary Company</dt><dd>'+ person.secondaryCo +'</dd>';
		} else {
			htmlSecondaryCo = '<dt>Secondary Company</dt><dd>--</dd>';
		}

		// Hometown
		if (person.city && person.state) {
			htmlHometown = '<dt>Home Town</dt><dd>'+ person.city +', '+ person.state +'</dd>';
		} else if (person.city) {
			htmlHometown = '<dt>Home Town</dt><dd>'+ person.city +'</dd>';
		} else if (person.state) {
			htmlHometown = '<dt>Home Town</dt><dd>'+ person.state +'</dd>';
		} else {
			htmlHometown = '<dt>Home Town</dt><dd>--</dd>';
		}

		// Industry
		if (person.industry) {
			htmlIndustry = '<dt>Industry</dt><dd>'+ person.industry +'</dd>';
		} else {
			htmlIndustry = '<dt>Industry</dt><dd>--</dd>';
		}

		// Undergraduate College
		if (person.undergrad) {
			htmlUndergrad = '<dt>Undergraduate College</dt><dd>'+ person.undergrad +'</dd>';
		} else {
			htmlUndergrad = '<dt>Undergraduate College</dt><dd>--</dd>';
		}

		// Graduate College
		if (person.grad) {
			htmlGrad = '<dt>Graduate College</dt><dd>'+ person.grad +'</dd>';
		} else {
			htmlGrad = '<dt>Graduate College</dt><dd>--</dd>';
		}

		// Professional Association
		if (person.profAssoc) {
			formatData(person.profAssoc, profAssoc, formattedProfAssoc);
			htmlProfAssoc = '<dt>Professional Associations</dt><dd>'+ formattedProfAssoc +'</dd>';
		} else {
			htmlProfAssoc = '<dt>Professional Associations</dt><dd>--</dd>';
		}

		// Civic Affiliation
		if (person.civicAffil) {
			formatData(person.civicAffil, civicAffil, formattedCivicAffil);
			htmlCivicAffil = '<dt>Civic Affiliations</dt><dd>'+ formattedCivicAffil +'</dd>';
		} else {
			htmlCivicAffil = '<dt>Civic Affiliations</dt><dd>--</dd>';
		}

		// Biography Link
		if (person.bio) {
			htmlBio = '<dt>Biography</dt><dd><a href="'+ person.bio +'" target="_blank">Click here</a></dd></dl>';
		} else {
			htmlBio = '<dt>Biography</dt><dd>--</dd></dl>';
		}

		var htmlImage = '<div class="photo"><img src="../assets/im/media/' + person.img + '" height="100" width="83" alt="" /></div>',
			htmlName = '<h2><span>'+ person.first + ' ' + person.middle + ' </span>' + person.last +'</h2>',
			personDetails =
				'<li data-whoswho-id="'+ id +'">'+
					htmlImage +
					htmlPwr50 +
					htmlName +
					htmlPrimaryCo +
					htmlSecondaryCo +
					htmlIndustry +
					htmlUndergrad +
					htmlGrad +
					htmlHometown +
					htmlProfAssoc +
					htmlCivicAffil +
					htmlBio +
				'</li>';

		if (container.find('[data-whoswho-id="'+ id +'"]').length > 0) {
			container.find('[data-whoswho-id="'+ id +'"]').removeClass('old');
		} else {
			container.append(personDetails);
		}
	});
	animatePersonOut(resultContainer);
}

/*****************************************************************************
Animate Grid
*****************************************************************************/
function animatePersonIn(resultContainer) {
	if ($(resultContainer + ' li:hidden').length > 0) {
		$(resultContainer + ' li:hidden').first().show('drop', {direction : 'right', easing : 'linear'}, 100, function() {
			animatePersonIn(resultContainer);
		});
	}
}
function animatePersonOut(resultContainer) {
	var container = $(resultContainer);
	container.children('.old').delay(300).hide('drop', {direction : 'left', easing : 'linear'}, function() {
		container.children('.old').remove();
	});
}

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
		overlayWrap.on('click', '[data-function="close"], .controls button[data-function="remove"]', function() {
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
		$('body').on('click', '[data-function^="overlay"]', function(event) {
			overlay.launchItem($(this).attr('data-function'));
			event.preventDefault();
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
Initialize
*****************************************************************************/
$(document).ajaxComplete(function() {
	obj = $.parseJSON(data.responseText);
	buildSelectOption();
	initiateAutoComplete();
	multipleEntry();
	removeEntry();
	loadResults(allWhosWho, '#all-whos-who');
	$('#all-whos-who').show().children().show();
});

$('body').on('click', '[data-function="done"]', function() {
	buildUserProfile();
});

runFilter();
overlay.details();
overlay.getName();
overlay.hideItem();
})();