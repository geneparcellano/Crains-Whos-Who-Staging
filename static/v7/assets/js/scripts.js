// (function() {
	'use strict';

var obj,
	data = $.getJSON("assets/js/whoswho.json"),
	user = [],
	connectionByCompany = [],
	connectionByIndustry = [],
	connectionByUndergrad = [],
	connectionByGrad = [],
	connectionByHometown = [],
	connectionByProfAssoc = [],
	connectionByCivicAffil = [],
	userConnections = [],
	allWhosWho = [],
	loadedProfiles = [],
	linkedInMyCompany,
	linkedInConnections = [],
	parent = $('#whos-who');

/*****************************************************************************
Auto Complete
*****************************************************************************/
function initiateAutoComplete() {

	var allCompanies = [],
		allProfAssoc = [],
		allCivicAffil = [],
		allUndergrad = [],
		allGrad = [],
		allCity = [],
		allData = [];

	// Sort Who's Who by last name
	obj.whoswho.sort(function (a,b) {
		var pNameA = a.last,
			pNameB = b.last;

		if (pNameA < pNameB) return -1;
		if (pNameA > pNameB) return 1;
		return 0;
	});


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
	$( ".autocomplete-company" ).autocomplete({
		appendTo: '.overlay-main',
		source: allCompanies
	});

	// concat data into one array
	var allData = allProfAssoc.concat(
			allCompanies,
			allCivicAffil,
			allUndergrad,
			allGrad,
			allCity
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
		connectionDetails = $('#connection-details'),
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
	yourScore.find('#profile-state').children('strong').text (userState);

	// Update "connection by type" count
	connectionDetails.find('#profile-company').children('span').text(connectionByCompany.length + ' Connections');
	connectionDetails.find('#profile-industry').children('span').text(connectionByIndustry.length + ' Connections');
	connectionDetails.find('#profile-undergrad').children('span').text(connectionByUndergrad.length + ' Connections');
	connectionDetails.find('#profile-grad').children('span').text(connectionByGrad.length + ' Connections');
	connectionDetails.find('#profile-hometown').children('span').text(connectionByHometown.length + ' Connections');
	connectionDetails.find('#profile-prof-assoc').children('span').text(connectionByProfAssoc.length + ' Connections');
	connectionDetails.find('#profile-civic-affil').children('span').text(connectionByCivicAffil.length + ' Connections');

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
	$('fieldset:not(#question-name)').on('blur', 'input[type="text"], select, .multi button', function() {
		if ($(this).val().length !== 0) {
			buildUserProfile();
			loadResults(userConnections, '#connections');
		}
	});
	$('#overlay-survey').on('click', '[data-function="close"], #survey-done', function() {
		buildUserProfile();
		loadResults(userConnections, '#connections');
	});
}

/*****************************************************************************
Index Results
*****************************************************************************/
function indexResults(arrayName, i) {
	if ($.inArray(i, arrayName) === -1) {
		arrayName.push(i);
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
	connectionByCompany.length = 0;
	connectionByIndustry.length = 0;
	connectionByUndergrad.length = 0;
	connectionByGrad.length = 0;
	connectionByHometown.length = 0;
	connectionByProfAssoc.length = 0;
	connectionByCivicAffil.length = 0;

	/*****************************************************************************
	Score matches
	*****************************************************************************/
	function scoreMatches(pName, value, multiplier, i, b) {

		switch(pName) {
			case 'profAssoc':
			case 'civicAffil':
				// Compare value against all of user's entries 
				$.each(user[0][pName], function(b, userValue) {
					var userValue = userValue.toLowerCase();
					if (value.toLowerCase().indexOf(userValue) !== -1 || value === userValue) {
						totalScore += multiplier;
						totalMatch++;

						// Index Connections
						indexResults(userConnections, i);

						// Index connection type
						switch(pName) {
							case 'civicAffil':
								indexResults(connectionByCivicAffil, i);
								break;
							case 'profAssoc':
								indexResults(connectionByProfAssoc, i);
								break;
							default:
								// Do nothing
						}
					} else {
						// Do nothing
					}
				});
				break;
			case 'primaryCo':
			case 'industry':
			case 'undergrad':
			case 'grad':
			case 'city':
				var userValue = user[0][pName].toLowerCase();
				if (userValue.length === 0) {
					return false;
				}
				if (value.toLowerCase().indexOf(userValue) !== -1 || value === userValue) {
					totalScore += multiplier;
					totalMatch++;

					// Index Connections
					indexResults(userConnections, i);

					// Index connection type
					switch(pName) {
						case 'primaryCo':
							indexResults(connectionByCompany, i);
							break;
						case 'industry':
							indexResults(connectionByIndustry, i);
							break;
						case 'undergrad':
							indexResults(connectionByUndergrad, i);
							break;
						case 'grad':
							indexResults(connectionByGrad, i);
							break;
						case 'city':
							indexResults(connectionByHometown, i);
							break;
						default:
							// Do nothing
					}
				}
				break;
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

		// Update Share Text
		$('#tweet-button iframe').remove();

		// Generate new markup
		var tweetBtn = $('<a></a>')
		    .addClass('twitter-share-button')
		    .attr('href', 'http://twitter.com/share')
		    .attr('data-url', '')
		    .attr('data-text', 'I scored '+finalScore+' on @CrainsChicago Clout Calculator. Get your score:');
		$('#tweet-button').append(tweetBtn);
		twttr.widgets.load();

		$('#share-score-email').attr('href', "mailto:?subject=Crain's Who's Who 2012&body= I scored "+finalScore+" on @CrainsChicago Clout Calculator. I'm connected to "+totalMatch+" of the most important business leaders. Get your score: chicagobusiness.com/whoswho");

		totalScore = 0;

		// Updates "Your Score" window accordingly
		if (finalScore === 0) {
			$('#overlay-your-score [data-function="user-profile-edit"]').show();
			$('.view-connections').hide();
			$('.share-score').hide();
		} else {
			$('#overlay-your-score [data-function="user-profile-edit"]').hide();
			$('.view-connections').show();
			$('.share-score').show();
		}
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
						// compare all of CWW's values against the user's value
						$.each(value, function(b, entries) {
							scoreMatches(property, entries, 3, i, b);
						});
						break;
					case 'civicAffil':
						// compare all of CWW's values against the user's value
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

	specialConnections();
}

/*****************************************************************************
Build industry list
*****************************************************************************/
function buildSelectOption() {
	var html = '';
	$.each(obj.industries, function(i, industries) {
		html += '<option value="' + industries + '">' + industries + '</option>';
	});
	$('.industry-list').append(html);
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
	var section = $(resultContainer),
		container = section.children('ul');

	// Mark obsolete matches
	container.children('li').addClass('old');

	$.each(arrayName, function(i, id) {
		var	person = obj.whoswho[id],
			htmlImage,
			htmlName,
			htmlSuffix,
			htmlPrimaryTitle,
			htmlPwr50,
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

		// Suffix
		if (person.suffix) {
			htmlSuffix = ', '+person.suffix;
		} else {
			htmlSuffix = '';
		}

		// Title
		if (person.primaryTitle) {
			htmlPrimaryTitle = '<div class="primary-title">'+ person.primaryTitle +'<br />'+ person.primaryCo +'</div>';
		} else {
			htmlPrimaryTitle = '';
		}

		// Power 50
		if (person.pwr50) {
			htmlPwr50 = '<div class="badges"><span class="pwr50">Power 50</span><span class="linkedin">LinkedIn</span></div>';
		} else {
			htmlPwr50 = '<div class="badges"><span class="linkedin">LinkedIn</span></div>';
		}

		// Primary Company
		if (person.primaryCo) {
			htmlPrimaryCo = '<dt>Primary Company</dt><dd>'+ person.primaryCo +'</dd>';
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
			htmlBio = '<dt>Biography</dt><dd>--</dd>';
		}

		var htmlImage = '<div class="photo"><img src="assets/im/media/' + person.img + '" height="100" width="83" alt="" /></div>',
			htmlName = '<h2><span>'+ person.first + ' ' + person.middle + ' </span>' + person.last + htmlSuffix +'</h2>',
			personDetails =
				'<li data-whoswho-id="'+ id +'">'+
					htmlImage +
					'<div class="credentials" data-name="'+ person.first + person.last +'">'+
					htmlName +
					htmlPrimaryTitle +
					htmlPwr50 +
					'</div><dl>'+
					htmlPrimaryCo +
					htmlSecondaryCo +
					htmlIndustry +
					htmlUndergrad +
					htmlGrad +
					htmlHometown +
					htmlProfAssoc +
					htmlCivicAffil +
					htmlBio +
					'</dl>'+
				'</li>';

		// If existing person is still a valid match, remove mark
		if (container.find('[data-whoswho-id="'+ id +'"]').length) {
			container.find('[data-whoswho-id="'+ id +'"]').removeClass('old');
		} else {
			container.append(personDetails);
		}
	});

	if (arrayName.length) {
		section.children('p').remove();
		section.slideDown('fast');
	} else if (section.children('p').length <= 0 && resultContainer === '#connections') {
		section.slideDown('fast').append('<p>No connections found. Try editing your <a href="#overlay-survey" data-function="user-profile-edit">profile</a>.</p>');
	} else if (section.children('p').length <= 0) {
		section.slideDown('fast').append('<p>No results found.</p>');
	}

	// Show matches
	animatePersonIn(resultContainer);

	// Update result count
	section.children('h1').children('strong').text(': ' + arrayName.length);

	// Hide deprecated matches
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
Filter Connections By Type
*****************************************************************************/
function filterConnection() {
	$('#connection-details').on('click', 'li[id^="profile-"]', function() {
		var property = $(this).attr('id'),
			value = property.slice(8);
		switch (value) {
			case 'company':
				loadResults(connectionByCompany, '#filtered');
				break;
			case 'industry':
				loadResults(connectionByIndustry, '#filtered');
				break;
			case 'undergrad':
				loadResults(connectionByUndergrad, '#filtered');
				break;
			case 'grad':
				loadResults(connectionByGrad, '#filtered');
				break;
			case 'hometown':
				loadResults(connectionByHometown, '#filtered');
				break;
			case 'prof-assoc':
				loadResults(connectionByProfAssoc, '#filtered');
				break;
			case 'civic-affil':
				loadResults(connectionByCivicAffil, '#filtered');
				break;
			default:
				// Do nothing
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
		$(resultContainer).slideUp('fast');
	}

	// Load Results
	loadResults(results, resultContainer);
}

/*****************************************************************************
Search Bar
*****************************************************************************/
function searchBar() {
	var searchBar = $('#control-bar .search'),
		results = $('#filtered');

	searchBar.on('keydown', '#whos-who-search', function(event) {
		var searchTerm = $(this).val().toLowerCase();

		if (searchTerm) {
			$('[data-function="reset"]').show();
		} else {
			$('[data-function="reset"]').hide();
		}

		if ( event.which === 13 ) {
			getResults(searchTerm, '#filtered');
		}
	});

	searchBar.on('click', 'button[data-function="search"]', function() {
		var searchTerm = $('.search input').val();

		getResults(searchTerm, '#filtered');
	});

	// clear results
	function clearResults() {
		results.slideUp('fast');
		// remove previous results from DOM
		results.children('ul').children('li').remove();
		searchBar.find('#whos-who-search').val('');
		$('button[data-function="reset"]').hide();
	}

	// clear results
	results.on('click', '[data-function="close"]', function() {
		clearResults();
	});

	// clear results
	searchBar.on('click', 'button[data-function="reset"]', function() {
		clearResults();
	});
}

/*****************************************************************************
Survey Navigation
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
Get LinkedIn Data
*****************************************************************************/
function loadData() {

	IN.API.Profile("me")
		.fields(["firstName","lastName","headline","positions:(company)"])
		.result(function(result) {
			linkedInMyCompany = result.values[0].positions['values'][0].company['name'];
			var questions = $('#questions');
			questions.find('#survey-first').val(result.values[0].firstName);
			questions.find('#survey-last').val(result.values[0].lastName);
			questions.find('#survey-company').val(linkedInMyCompany);

			if ($('#overlay-survey').find('#question-linkedin').length && IN.User.isAuthorized() && $('#linkedin-sign-out').length === 0) {
				$('<div id="linkedin-sign-out" onclick="IN.User.logout($(\'#linkedin-sign-out\').remove())"><span class="logo-linkedin"></span>Sign Out</a>').appendTo('#question-linkedin');
			}
		});

	IN.API.Connections("me")
		.fields(["id", 'headline', "first-name", "last-name", "picture-url", "positions"])
		.params({'count':500, 'sort': 'distance'})
		.result(function(result){

			$.each(result.values, function(a, b) {
				if (b.firstName !== 'private' && b.positions['values']) {
					var person = {},
						companyName = b.positions['values'][0].company['name'];

					person['company'] = companyName;
					person['first'] = b.firstName;
					person['last'] = b.lastName;

					linkedInConnections.push(person);
				}
			});

			linkedInApplyData();
		});
}

/*****************************************************************************
Apply Linked In Data
*****************************************************************************/
function linkedInApplyData() {

	var workConnections = [];
	$.each(linkedInConnections, function(i, info) {
		if (info.company.indexOf(linkedInMyCompany) !== -1) {
			var person = {};

			person['company'] = info.company;
			person['first'] = info.first;
			person['last'] = info.last;

			workConnections.push(person);
		}
	});

	linkedInConnections.length = 0;
	linkedInConnections.push(workConnections);
	linkedInMatchData();
}

/*****************************************************************************
Match LinkedIn Data with Who's Who
*****************************************************************************/
function linkedInMatchData() {
	$(document.createElement('style')).appendTo('head').attr('id','linkedInStyles');
	var linkedInStyles = $('style#linkedInStyles');

	function compareData(company, first, last) {
		$.each(obj.whoswho, function(a, b) {
			if (b.primaryCo === company && b.last === last && b.first === first) {
				linkedInStyles.append('[data-name="'+b.first+b.last+'"] .linkedin, #overlay-whos-who-details [data-name="'+b.first+b.last+'"] .linkedin {display:block;}');
			}
		});
	}

	$.each(linkedInConnections[0], function(a, b) {
		compareData(b.company, b.first, b.last);
	});
}

/*****************************************************************************
Initialize
*****************************************************************************/
$('#whos-who-2012').on('click','[data-function="user-profile-edit"]', function() {
	var survey = $('#overlay-survey'),
		linkedIn = '<fieldset id="question-linkedin">'+
						'<legend>LinkedIn</legend>'+
						'<label>LinkedIn</label>'+
					'</fieldset>';

	// update survey layout
	survey.addClass('user-profile-edit')
		.children('.controls').find('strong').text('Your Profile');
	survey.find('fieldset').show();

	if (survey.find('#question-linkedin').length === 0 ) {
		survey.find('#question-name').after(linkedIn);
		$('#question-name .IN-widget').appendTo('#question-linkedin');

		if (IN.User.isAuthorized()) {
			$('<div id="linkedin-sign-out" onclick="IN.User.logout($(\'#linkedin-sign-out\').remove())"><span class="logo-linkedin"></span>Sign Out</a>').appendTo('#question-linkedin');
		} else {
			// Do nothing
		}
	}

	// move done button to end of form
	$('#survey-done').appendTo(survey.children('form'));
	overlay.launchItem('overlay-survey');
});

overlay.launchItem('overlay-intro'); // launch intro
searchBar();
runFilter();
navigation.getCurrent();
navigation.nextPrev();
navigation.disableButton();
overlay.details();
overlay.getName();
overlay.hideItem();

$(document).ajaxComplete(function() {
	obj = $.parseJSON(data.responseText);
	buildSelectOption();
	initiateAutoComplete();
	multipleEntry();
	removeEntry();
	loadWhosWho();
	showOnScroll();
	filterConnection();
	loadData();
});

// })();