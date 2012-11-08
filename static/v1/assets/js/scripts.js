(function() {
	//'use strict';

/*****************************************************************************
Get JSON
*****************************************************************************/
var data = $.getJSON("assets/js/whoswho.json"),
	obj,
	allFirst = [],
	allLast = [],
	allCompanies = [],
	allProfAssoc = [],
	allCivicAffil = [],
	allUndergrad = [],
	allGrad = [],
	allCity = [],
	allState = [],
	allData = [],
	loadedProfile = [];

function compilePersonInfo() {
	var max = 0;
	$.each(obj.whoswho, function(i, whoswho) {
		var	profAssoc,
			civicAffil,
			formattedProfAssoc = [],
			formattedCivicAffil = [];

		function formatData(array, id, newArray) {
			if (array[0] !== undefined && array[0].length > 1) {
				$.each(array, function(i, id) {
					newArray.push(' ' + id);
				});
			} else {
				// do nothing
			}
		}

		// Power 50
		if (whoswho.pwr50) {
			htmlPwr50 = '<div class="pwr50">Power 50</div>';
		} else {
			htmlPwr50 = '';
		}

		// Primary Company
		if (whoswho.primaryCo) {
			htmlPrimaryCo = '<dl><dt>Primary Company</dt><dd>'+ whoswho.primaryCo +'</dd>';
		} else {
			htmlPrimaryCo = '<dl><dt>Primary Company</dt><dd>--</dd>'
		}

		// Secondary Company
		if (whoswho.secondaryCo) {
			htmlSecondaryCo = '<dt>Secondary Company</dt><dd>'+ whoswho.secondaryCo +'</dd>';
		} else {
			htmlSecondaryCo = '<dt>Secondary Company</dt><dd>--</dd>';
		}

		// Hometown
		if (whoswho.city && whoswho.state) {
			htmlHometown = '<dt>Home Town</dt><dd>'+ whoswho.city +', '+ whoswho.state +'</dd>';
		} else if (whoswho.city) {
			htmlHometown = '<dt>Home Town</dt><dd>'+ whoswho.city +'</dd>';
		} else if (whoswho.state) {
			htmlHometown = '<dt>Home Town</dt><dd>'+ whoswho.state +'</dd>';
		} else {
			htmlHometown = '<dt>Home Town</dt><dd>--</dd>';
		}

		if (whoswho.industry) {
			htmlIndustry = '<dt>Industry</dt><dd>'+ whoswho.industry +'</dd>';
		} else {
			htmlIndustry = '<dt>Industry</dt><dd>--</dd>';
		}

		// Undergraduate College
		if (whoswho.undergrad) {
			htmlUndergrad = '<dt>Undergraduate College</dt><dd>'+ whoswho.undergrad +'</dd>';
		} else {
			htmlUndergrad = '<dt>Undergraduate College</dt><dd>--</dd>';
		}

		// Graduate College
		if (whoswho.grad) {
			htmlGrad = '<dt>Graduate College</dt><dd>'+ whoswho.grad +'</dd>';
		} else {
			htmlGrad = '<dt>Graduate College</dt><dd>--</dd>';
		}

		// Professional Association
		if (whoswho.profAssoc) {
			formatData(whoswho.profAssoc, profAssoc, formattedProfAssoc);
			htmlProfAssoc = '<dt>Professional Associations</dt><dd>'+ formattedProfAssoc +'</dd>';
		} else {
			htmlProfAssoc = '<dt>Professional Associations</dt><dd>--</dd>';
		}

		// Civic Affiliation
		if (whoswho.civicAffil) {
			formatData(whoswho.civicAffil, civicAffil, formattedCivicAffil);
			htmlCivicAffil = '<dt>Civic Affiliations</dt><dd>'+ formattedCivicAffil +'</dd>';
		} else {
			htmlCivicAffil = '<dt>Civic Affiliations</dt><dd>--</dd>';
		}

		// Biography Link
		if (whoswho.bio) {
			htmlBio = '<dt>Biography</dt><dd><a href="'+ whoswho.bio +'" target="_blank">Click here</a></dd></dl>';
		} else {
			htmlBio = '<dt>Biography</dt><dd>--</dd></dl>';
		}

		var htmlImage = '<div class="photo"><img src="assets/im/media/' + whoswho.img + '" height="100" width="83" alt="" /></div>',
			htmlName = '<h2><span>'+ whoswho.first + ' ' + whoswho.middle + ' </span>' + whoswho.last +'</h2>',
			person =
				'<li>'+
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
					htmlCivicAffil+
					htmlBio +
				'</li>';

		if ($.inArray(i, loadedProfile) === -1) {
			// populate Who's Who Details
			$('#all-whos-who ul').append(person);
			loadedProfile.push(i);
			max++;
			return max < 45;
		} else {
			// Do nothing
		}


	});
	$('#all-whos-who').fadeIn(1300);
}

/*****************************************************************************
Show More on Scroll
*****************************************************************************/
function showOnScroll() {
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			compilePersonInfo();
		}
	});
}

/*****************************************************************************
Auto Complete
*****************************************************************************/
function initiateAutoComplete() {

	/*****************************************************************************
	scrape all values and push into specified array
	*****************************************************************************/
	function pushData(array, id, newArray) {
		if (array[0] !== undefined && array[0].length > 1) {
			$.each(array, function(i, id) {
				// check if value already exists
				if ($.inArray(id, newArray) === -1) {
					newArray.push(id);
				} else {
					//do nothing
				}
			});
		} else {
			if ($.inArray(array, newArray) === -1) {
				newArray.push(array);
			} else {
				//do nothing
			}
		}
	}

	/*****************************************************************************
	Push data into array, for Autocomplete feature // pushData(array, id, newArray)
	*****************************************************************************/
	$.each(obj.whoswho, function(i, whoswho) {
		var first,
			last,
			companies,
			profAssoc,
			civicAffil,
			undergraduate,
			graduate,
			degree,
			city,
			state;

		pushData(whoswho.first, first, allFirst);
		pushData(whoswho.last, last, allLast);
		pushData(whoswho.profAssoc, profAssoc, allProfAssoc);
		// pushData(whoswho.civicAffil, civicAffil, allCivicAffil);
		// pushData(whoswho.undergraduate, undergraduate, allUndergrad);
		// pushData(whoswho.graduate, graduate, allGrad);
		// pushData(whoswho.city, city, allCity);
		// pushData(whoswho.state, state, allState);

		// build companies list
		// pushData(obj.companies, companies, allCompanies);
		// $.each(obj.companies, function(i, companies) {
		// 	allCompanies.push(companies);
		// });	
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
Build industry list (<select>)
****************************************************************************/
function buildSelectOption() {
	$.each(obj.industries, function(i, industries) {
		var html = '<option value="'+industries+'">'+industries+'</option>';
		$('.industry-list').append(html);
	});
}

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
	nextQuestion : function() {
		$('#questions').on('keydown', 'input[type="text"], select', function() {
			$(this).parent('label').next().length;
			if ( event.which === 13 ) {
				if ( $(this).parent('label').next().length === 0 ) {
					// $('#questions button[data-function="next"]').focus();
					navigation.showNext();
					navigation.disableButton();
				}
			}
		});
	},
	runFilter : function() {
		$('#overlay-survey').on('keydown focusout', 'input[type="text"], select', function(event) {

			if ( event.which === 13 || event.type === 'focusout') {
				var $this = $(this),
					value = $this.val(),
					id = $this.attr('id');

				switch (id) {
					case 'survey-company':
					case 'survey-industry':
					case 'survey-undergrad':
					case 'survey-grad':
					case 'survey-hometown':
					case 'survey-state':
					case 'survey-civic-affil':
					case 'survey-prof-assoc':
						search.getResults(value.toLowerCase(), '#connections');
					default:
						// Do nothing
				}
			}
		});
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
			event.preventDefault();0
		});
	},
	syncHeader : function() {
		var selected = 'a[href="#'+ navigation.getCurrent().attr('id') +'"]',
			newTitle = $('a[href="#'+ navigation.getCurrent().attr('id') +'"]').text();
		$('.controls ol li').removeClass('selected').children(selected).parent('li').addClass('selected');
		$('#overlay-survey .controls strong').text(newTitle);
	},
	showPrev : function() {
		navigation.getCurrent().prev().fadeIn('fast');
		navigation.getCurrent().hide().removeClass('selected').prev().addClass('selected');
		navigation.syncHeader();
	},
	showNext : function() {
		navigation.getCurrent().next().fadeIn('fast');
		navigation.getCurrent().hide().removeClass('selected').next().addClass('selected');
		navigation.syncHeader();
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
Search
*****************************************************************************/
var search = {
	getValue : function() {
		var searchBar = $('.search');
		searchBar.on('keydown', 'input[type="text"]', function() {
			var searchTerm = $('.search input').val().toLowerCase();

			if ( event.which === 13 ) {
				$(".ui-autocomplete").hide();
				search.getResults(searchTerm, '#filtered');
			}
		});
		searchBar.on('click', 'button[data-function="search"]', function() {
			var searchTerm = $('.search input').val().toLowerCase();
			search.getResults(searchTerm, '#filtered');
		});
	},
	getResults : function(searchTerm, container) {
		var results = [];

		if (searchTerm) {

			if (container === '#connections') {
				$(container).show();
			} else {
				$(container + ' ul').html('').parent(container).show();
			}


			// Search through all values
			$.each(obj.whoswho, function(i, wwwdetails) {
				$.each(wwwdetails, function(property, value) {

					switch (property) {
					case "first":
					case "last":
					case "primaryCo":
					case "industry" :
					case "profAssoc":
					case "civicAffil":
					case "undergrad":
					case "grad":
						var	profAssoc,
							civicAffil,
							formattedProfAssoc = [],
							formattedCivicAffil = [];



						// Show Search Results
						function showMatches(value) {	

							if ($.type(value) ==='string' && value.toLowerCase().indexOf(searchTerm) !== -1 && $.inArray(i, results) === -1) {
								results.push(i);

								function formatData(array, id, newArray) {
									if (array[0] !== undefined && array[0].length > 1) {
										$.each(array, function(i, id) {
											newArray.push(' ' + id);
										});
									} else {
										// do nothing
									}
								}

								// Power 50
								if (wwwdetails.pwr50) {
									htmlPwr50 = '<div class="pwr50">Power 50</div>';
								} else {
									htmlPwr50 = '';
								}

								// Primary Company
								if (wwwdetails.primaryCo) {
									htmlPrimaryCo = '<dl><dt>Primary Company</dt><dd>'+ wwwdetails.primaryCo +'</dd>';
								} else {
									htmlPrimaryCo = '<dl><dt>Primary Company</dt><dd>--</dd>'
								}

								// Secondary Company
								if (wwwdetails.secondaryCo) {
									htmlSecondaryCo = '<dt>Secondary Company</dt><dd>'+ wwwdetails.secondaryCo +'</dd>';
								} else {
									htmlSecondaryCo = '<dt>Secondary Company</dt><dd>--</dd>';
								}

								// Hometown
								if (wwwdetails.city && wwwdetails.state) {
									htmlHometown = '<dt>Home Town</dt><dd>'+ wwwdetails.city +', '+ wwwdetails.state +'</dd>';
								} else if (wwwdetails.city) {
									htmlHometown = '<dt>Home Town</dt><dd>'+ wwwdetails.city +'</dd>';
								} else if (wwwdetails.state) {
									htmlHometown = '<dt>Home Town</dt><dd>'+ wwwdetails.state +'</dd>';
								} else {
									htmlHometown = '<dt>Home Town</dt><dd>--</dd>';
								}

								if (wwwdetails.industry) {
									htmlIndustry = '<dt>Industry</dt><dd>'+ wwwdetails.industry +'</dd>';
								} else {
									htmlIndustry = '<dt>Industry</dt><dd>--</dd>';
								}

								// Undergraduate College
								if (wwwdetails.undergrad) {
									htmlUndergrad = '<dt>Undergraduate College</dt><dd>'+ wwwdetails.undergrad +'</dd>';
								} else {
									htmlUndergrad = '<dt>Undergraduate College</dt><dd>--</dd>';
								}

								// Graduate College
								if (wwwdetails.grad) {
									htmlGrad = '<dt>Graduate College</dt><dd>'+ wwwdetails.grad +'</dd>';
								} else {
									htmlGrad = '<dt>Graduate College</dt><dd>--</dd>';
								}

								// Professional Association
								if (wwwdetails.profAssoc) {
									formatData(wwwdetails.profAssoc, profAssoc, formattedProfAssoc);
									htmlProfAssoc = '<dt>Professional Associations</dt><dd>'+ formattedProfAssoc +'</dd>';
								} else {
									htmlProfAssoc = '<dt>Professional Associations</dt><dd>--</dd>';
								}

								// Civic Affiliation
								if (wwwdetails.civicAffil) {
									formatData(wwwdetails.civicAffil, civicAffil, formattedCivicAffil);
									htmlCivicAffil = '<dt>Civic Affiliations</dt><dd>'+ formattedCivicAffil +'</dd>';
								} else {
									htmlCivicAffil = '<dt>Civic Affiliations</dt><dd>--</dd>';
								}

								// Biography Link
								if (wwwdetails.bio) {
									htmlBio = '<dt>Biography</dt><dd><a href="'+ wwwdetails.bio +'" target="_blank">Click here</a></dd></dl>';
								} else {
									htmlBio = '<dt>Biography</dt><dd>--</dd></dl>';
								}

								var htmlImage = '<div class="photo"><img src="assets/im/media/' + wwwdetails.img + '" height="100" width="83" alt="" /></div>',
									htmlName = '<h2><span>'+ wwwdetails.first + ' ' + wwwdetails.middle + ' </span>' + wwwdetails.last +'</h2>',
									person =
										'<li>'+
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
											htmlCivicAffil+
											htmlBio +
										'</li>';

								// populate Who's Who Details
								$(container + ' h1 strong').text(searchTerm + ' (Results: ' + results.length + ')');
								$(person).appendTo(container + ' ul');
							} else {
								// Do nothing
							}
						}

						// Search JSON
						if (property === 'profAssoc' || property === 'civicAffil') {
							$.each(value, function(i, value) {
								showMatches(value);
							});
						} else {
							showMatches(value);
						}

					default:
						// Do nothing
					}
				});
			});
			animateDropPerson(container);
		} else {
			$(container + ' h1').hide().parent(container).slideUp('fast').children('h1').show();
		}
	}
}

/*****************************************************************************
Animate Grid
*****************************************************************************/
function animateDropPerson(id) {
	if ($(id + ' li:hidden').length > 0) {
		$(id + ' li:hidden').first().show('drop', {direction : 'right', easing : 'linear'}, 100, function() {
			animateDropPerson(id);
		});
	}
}

/*****************************************************************************
User Profile
*****************************************************************************/
var user = {
	getInfo : function() {
		$('#survey-done').on('click', function() {
			var survey = $('#questions'),
				surveyPrefix = survey.find('#survey-prefix').val(),
				surveyFirst = survey.find('#survey-first').val(),
				surveyLast = survey.find('#survey-last').val(),
				surveySuffix = survey.find('#survey-suffix').val(),
				surveyCompany  = survey.find('#survey-company').val(),
				surveyIndustry = survey.find('#survey-industry').val(),
				surveyUndergrad = survey.find('#survey-undergrad').val(),
				surveyGrad = survey.find('#survey-grad').val(),
				surveyCity = survey.find('#survey-hometown').val(),
				surveyState = survey.find('#survey-state').val(),
				surveyProfAssoc = survey.find('#survey-prof-assoc').val(),
				surveyCivicAffil = survey.find('#survey-civic-affil').val();

			localStorage.setItem('userPrefix', surveyPrefix);
			localStorage.setItem('userName', surveyFirst);
			localStorage.setItem('userLast', surveyLast);
			localStorage.setItem('userSuffix', surveySuffix);
			localStorage.setItem('userIndustry', surveyIndustry);

			user.updateProfile(
				surveyPrefix,
				surveyFirst,
				surveyLast,
				surveySuffix,
				surveyCompany,
				surveyIndustry,
				surveyUndergrad,
				surveyGrad,
				surveyCity,
				surveyState
				// surveyProfAssoc,
				// surveyCivicAffil
			);
		});
	},
	getFilter : function() {
		$('#overlay-user-profile').on('click','li', function() {
			var searchTerm = $(this).children('strong').text().toLowerCase();
			search.getResults(searchTerm, '#filtered');
		});
	},
	updateProfile : function(surveyPrefix, surveyFirst, surveyLast, surveySuffix, surveyCompany, surveyIndustry, surveyUndergrad, surveyGrad, surveyCity, surveyState, surveyProfAssoc, surveyCivicAffil) {
		var profile = $('#overlay-user-profile'),
			editProfile = $('#overlay-user-profile-edit');

		// User Profile
		profile.find('#profile-name').text(surveyFirst + ' ' + surveyLast);
		profile.find('#profile-company').children('strong').text(surveyCompany);
		profile.find('#profile-prof-assoc').children('strong').text(surveyProfAssoc);
		profile.find('#profile-civic-affil').children('strong').text(surveyCivicAffil);

		// User Profile Edit
		editProfile.find('#profile-edit-first').val(surveyFirst);
		editProfile.find('#profile-edit-last').val(surveyLast);
		editProfile.find('#profile-edit-suffix').val(surveySuffix);
		editProfile.find('#profile-edit-company').val(surveyCompany);
		editProfile.find('#profile-edit-prof-assoc').val(surveyProfAssoc);
		editProfile.find('#profile-edit-civic-affil').val(surveyCivicAffil);
		editProfile.find('#profile-edit-undergrad').val(surveyUndergrad);
		editProfile.find('#profile-edit-grad').val(surveyGrad);
		editProfile.find('#profile-edit-town').val(surveyCity);
		editProfile.find('#profile-edit-state').val(surveyState);
	}
}

/*****************************************************************************
Initialize
*****************************************************************************/
$(document).ajaxComplete(function() {
	obj = $.parseJSON(data.responseText);

	buildSelectOption();
	initiateAutoComplete();
	compilePersonInfo();
});

showOnScroll();

overlay.launchItem('overlay-intro'); // launch intro
overlay.details();
overlay.getName();
overlay.hideItem();

questionnaire.addEntry();
questionnaire.removeEntry();
questionnaire.nextQuestion();
questionnaire.runFilter();

navigation.getCurrent();
navigation.nextPrev();
navigation.disableButton();

search.getValue();

user.getInfo();
user.getFilter();
})();