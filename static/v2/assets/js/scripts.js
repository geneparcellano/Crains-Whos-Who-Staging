(function() {
	'use strict';

var obj,
	data = $.getJSON("assets/js/whoswho.json"),
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
		pushData(whoswho.profAssoc, allProfAssoc);
		pushData(whoswho.civicAffil, allCivicAffil);
		pushData(whoswho.undergrad, allUndergrad);
		pushData(whoswho.grad, allGrad);
		pushData(whoswho.city, allCity);
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
		appendTo: '.overlay-main',
		source: allProfAssoc
	});
	$( ".autocomplete-civic-affil" ).autocomplete({
		appendTo: '.overlay-main',
		source: allCivicAffil
	});
	$( ".autocomplete-undergraduate" ).autocomplete({
		appendTo: '.overlay-main',
		source: allUndergrad
	});
	$( ".autocomplete-graduate" ).autocomplete({
		appendTo: '.overlay-main',
		source: allGrad
	});
	$( ".autocomplete-hometown" ).autocomplete({
		appendTo: '.overlay-main',
		source: allCity
	});
	$( ".autocomplete-state" ).autocomplete({
		appendTo: '.overlay-main',
		source: allState
	});
	$( ".autocomplete-company" ).autocomplete({
		appendTo: '.overlay-main',
		source: allCompanies
	});

	// concat data into one array
	var allData = allProfAssoc.concat(
			// allFirst,
			// allLast,
			allCompanies,
			allCivicAffil,
			allUndergrad,
			allGrad,
			allCity
			// allState
		);

	$( "#whos-who-search" ).autocomplete({
		source: allData
	});

	// hide autocomplete when user enters custom term
	$('#whos-who-2012').on('keydown', 'input[type="text"]', function (event) {
		if(event.which === 13) {
			$(".ui-autocomplete").hide();
		}
	});
}

/*****************************************************************************
Build User Profile
*****************************************************************************/
function buildUserProfile() {
	var a = ['first', 'last', 'primaryCo', 'industry', 'profAssoc', 'civicAffil', 'undergrad', 'grad', 'city', 'state'],
		userProfAssoc = [],
		userCivicAffil = [],
		i = 0,
		obj = {},
		survey = $('form'),
		yourScore = $('#overlay-your-score'),
		userFirst = survey.find('#survey-first').val(),
		userLast = survey.find('#survey-last').val(),
		userCompany = survey.find('#survey-company').val(),
		userIndustry = survey.find('#survey-industry').val(),
		userUndergrad = survey.find('#survey-undergrad').val(),
		userGrad = survey.find('#survey-grad').val(),
		userCity = survey.find('#survey-city').val(),
		userState = survey.find('#survey-state').val();

	$.each($('#survey-prof-assoc .entries li'), function(i) {
		userProfAssoc.push($(this).text().slice(0, -6));
	});
	$.each($('#survey-civic-affil .entries li'), function(i) {
		userCivicAffil.push($(this).text().slice(0, -6));
	});

	//Set values
	obj[a[0]] = userFirst;
	obj[a[1]] = userLast;
	obj[a[2]] = userCompany;
	obj[a[3]] = userIndustry;
	obj[a[4]] = userProfAssoc;
	obj[a[5]] = userCivicAffil;
	obj[a[6]] = userUndergrad;
	obj[a[7]] = userGrad;
	obj[a[8]] = userCity;
	obj[a[9]] = userState;

	// Update "Your Score" overlay
	yourScore.find('#profile-name').text(userFirst + ' ' + userLast);
	yourScore.find('#profile-company').children('strong').text(userCompany);
	yourScore.find('#profile-prof-assoc').children('strong').text(userProfAssoc);
	yourScore.find('#profile-civic-affil').children('strong').text(userCivicAffil);
	yourScore.find('#profile-undergrad').children('strong').text(userUndergrad);
	yourScore.find('#profile-grad').children('strong').text(userGrad);
	yourScore.find('#profile-town').children('strong').text(userCity);
	yourScore.find('#profile-state').children('strong').text(userState);

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
		loadResults(userConnections, '#connections');
		animatePersonIn('#connections');
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

		$('.your-score').text(finalScore);
		$('#connections .matches').text(': '+totalMatch);

		totalScore = 0;
	}

	/*****************************************************************************
	Values to be scored
	*****************************************************************************/
	$.each(obj.whoswho, function(i, whoswho) {
		$.each(whoswho, function(property, value) {

			if (value.length !== 0) {
				switch (property) {
					case 'industry':
						scoreMatches(property, value, 0, i);
						break;
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
					case 'city':
						scoreMatches(property, value, 0, i);
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
	var multi = $('.multi');
	multi.on('click', 'button[data-function="add"]', function() {
		applyEntry($(this));
		buildUserProfile();
	});

	multi.on('keydown', 'input[type="text"]', function() {
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
	$('.multi').on('click','button[data-function="remove"]',function() {
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
	var container = $(resultContainer).children('ul');

	// Mark obsolete matches
	container.children('li').addClass('old');

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

		var htmlImage = '<div class="photo"><img src="assets/im/media/' + person.img + '" height="100" width="83" alt="" /></div>',
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

		// If existing person is still a valid match, remove mark
		if (container.find('[data-whoswho-id="'+ id +'"]').length) {
			container.find('[data-whoswho-id="'+ id +'"]').removeClass('old');
		} else {
			container.append(personDetails);
		}
	});

	if (arrayName.length) {	
		$(resultContainer).slideDown('fast');
	} else {
		// container.append('<li>No results found</li>');
		$(resultContainer).slideUp('fast');
	}

	// Hide obsolete matches
	animatePersonOut(resultContainer);
}

/*****************************************************************************
Animate Grid
*****************************************************************************/
function animatePersonIn(resultContainer) {
	var content = $(resultContainer).children('ul').children('li:hidden');
	if (content.length > 0) {
		content.first().show('drop', {direction : 'right', easing : 'linear'}, 100, function() {
			animatePersonIn(resultContainer);
		});
	}

	// Hide autocomplete
	$(".ui-autocomplete").hide();
}
function animatePersonOut(resultContainer) {
	var container = $(resultContainer).children('ul');
	container.children('.old').delay(100).hide('drop', {direction : 'left', easing : 'linear'}, function() {
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
		$('#whos-who-2012').on('click', '[data-function^="overlay"]', function(event) {
			overlay.launchItem($(this).attr('data-function'));
			event.preventDefault();
		});
	},
	launchItem : function(itemName) {
		// Prevents background from scrolling
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
Load All Whos Who 2012
*****************************************************************************/
var loadedProfiles = [];
function loadWhosWho() {
		var container = $('#all-whos-who').children('ul'),
			max = 0;

		// Index profiles that have been loaded
		$.each(allWhosWho, function(i, id) {
			if (i >= loadedProfiles.length) {
				loadedProfiles.push(id);
				max++;
				return max < 45;
			} else {
				// do nothing
			}
		});

		// Get results
		loadResults(loadedProfiles, '#all-whos-who');

		// Show results
		container.children('li').show('fast', function() {
			container.slideDown();
		});	
}

/*****************************************************************************
Show More on Scroll
*****************************************************************************/
function showOnScroll() {
	$(window).scroll(function() {
		// Show more profiles until all have been loaded
		if (loadedProfiles.length < allWhosWho.length) {
			if ($(window).scrollTop() + $(window).height() >= $(document).height() - 280) {
				loadWhosWho();
			}
		} else {
			$('.ajax-loading').remove();
		}
	});
}

/*****************************************************************************
Search
*****************************************************************************/
var results = [];
function getResults(searchTerm, resultContainer) {

	results.length = 0;

	if (searchTerm) {

		// Search through all values
		$.each(obj.whoswho, function(i, profile) {
			$.each(profile, function(property, value) {

				// Index matched values
				function matchTerm(value) {
					if ( $.type(value) ==='string' && value.toLowerCase().indexOf(searchTerm) !== -1 && $.inArray(i, results) === -1 ) {
						results.push(i);
					}
				}

				switch (property) {
				case "first":
				case "last":
				case "primaryCo":
				case "industry" :
				case "profAssoc":
				case "civicAffil":
				case "undergrad":
				case "grad":

					// Check if value has multiple entries
					if (property === 'profAssoc' || property === 'civicAffil') {
						$.each(value, function(i, value) {
							// Index matched values
							matchTerm(value);
						});
					} else {
						// Index matched values
						matchTerm(value);
					}

				default:
					// Do nothing
				}
			});
		});
	} else {
		// Do nothing
	}

	// Index Results
	loadResults(results, resultContainer);

	// Show results
	animatePersonIn(resultContainer);
}
function initSearch() {
	var searchBar = $('#control-bar .search');

	searchBar.on('keydown', '#whos-who-search', function(event) {
		if ( event.which === 13 ) {
			var searchTerm = $(this).val().toLowerCase();

			getResults(searchTerm, '#filtered');
			$('#filtered h1 strong').text(': ' + results.length);
		}
	});

	searchBar.on('click', 'button[data-function="search"]', function() {
		var searchTerm = $('.search input').val();

		getResults(searchTerm, '#filtered');
		$('#filtered h1 strong').text(': ' + results.length);
	});
}

/*****************************************************************************
Questionnaire Navigation
*****************************************************************************/
var current,
	navigation = {
	getCurrent : function() {
		return current = $('#questions fieldset.selected');
	},
	nextPrev : function() {
		$('button[data-function="prev"],button[data-function="next"]').on('click', function() {
			var direction = $(this).attr('data-function');

			if (direction === 'next') {
				navigation.showNext();
			} else {
				navigation.showPrev();
			}
			navigation.disableButton();
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
	syncHeader : function() {
		var selected = 'a[href="#'+ navigation.getCurrent().attr('id') +'"]',
			newTitle = current.children('legend').text();
		$('.controls ol li').removeClass('selected').children(selected).parent('li').addClass('selected');
		$('#overlay-survey .controls strong').text(newTitle);
	},
	showPrev : function() {
		navigation.getCurrent().prev().fadeIn('fast');
		navigation.getCurrent().hide().removeClass('selected').prev().addClass('selected');
		navigation.syncHeader();
		navigation.getCurrent().find('label:first').children().focus();
	},
	showNext : function() {
		navigation.getCurrent().next().fadeIn('fast');
		navigation.getCurrent().hide().removeClass('selected').next().addClass('selected');
		navigation.syncHeader();
		navigation.getCurrent().find('label:first').children().focus();
	},
	disableButton : function() {
		if (navigation.getCurrent().prev().length === 0) {
			$('button[data-function="prev"]').attr('disabled','disabled');
		} else {
			$('button[data-function="prev"]').removeAttr('disabled');
		}

		if (navigation.getCurrent().next().length === 0) {
			$('button[data-function="next"]').attr('disabled','disabled');
		} else {
			$('button[data-function="next"]').removeAttr('disabled');
		}
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
	loadWhosWho();
	showOnScroll();
});

$('form').on('click', '#survey-done', function() {
	buildUserProfile();
});

$('#control-bar').on('click','button[data-function="user-profile-edit"]', function() {
	var survey = $('#overlay-survey');
	survey.addClass('user-profile-edit')
		.children('.controls').find('strong').text('Your Profile');
	survey.find('fieldset').show();
	$('#survey-done').appendTo(survey.children('form'));
	overlay.launchItem('overlay-survey');
});
overlay.launchItem('overlay-intro'); // launch intro
// overlay.launchItem('overlay-user-profile-edit');
initSearch();
runFilter();
navigation.getCurrent();
navigation.nextPrev();
navigation.disableButton();
overlay.details();
overlay.getName();
overlay.hideItem();
})();