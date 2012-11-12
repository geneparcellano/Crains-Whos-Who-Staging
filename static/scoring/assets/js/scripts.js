(function() {
	'use strict';

var obj,
	data = $.getJSON("assets/js/whoswho.json"),
	user = [],
	userConnections = [];

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
	scrape all values and push into specified array
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
	Push data into array, for Autocomplete feature // pushData(array, id, newArray)
	*****************************************************************************/
	$.each(obj.whoswho, function(i, whoswho) {
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
	$('#whos-who-2012').on('keyup', 'input[type="text"]', function (e) {
		if(e.which === 13) {
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

	return user;
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

	specialConnections();
}

/*****************************************************************************
Build industry list (<select>)
*****************************************************************************/
function buildSelectOption() {
	$.each(obj.industries, function(i, industries) {
		var html = '<option value="'+industries+'">'+industries+'</option>';
		$('.industry-list').append(html);
	});
}

/*****************************************************************************
Add Entry
*****************************************************************************/
function addEntry() {
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

	$('#questions .multi').on('click', 'button[data-function="add"]', function() {
		applyEntry($(this));
	});

	$('#questions .multi').on('keydown', 'input[type="text"]', function() {
		if ( event.which == 13 ) {
			applyEntry($(this));
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
Initialize
*****************************************************************************/
$(document).ajaxComplete(function() {
	obj = $.parseJSON(data.responseText);
	buildSelectOption();
	initiateAutoComplete();
	addEntry();
	removeEntry();
});

$('body').on('click', '[data-function="done"]', function() {
	buildUserProfile();
});


})();