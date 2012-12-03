
var obj,
	data = $.getJSON("assets/js/whoswho.json"),
	linkedInMyCompany,
	linkedInConnections = [],
	parent = $('#whos-who');

/*****************************************************************************
Get LinkedIn Data
*****************************************************************************/
function loadData() {

	IN.API.Profile("me")
		.fields(["firstName","headline","positions:(company)"])
		.result(function(result) {
			linkedInMyCompany = result.values[0].positions['values'][0].company['name'];
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

					// console.log(person);
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
			// console.log(info.first + ' ' +info.last);
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
				// console.log(b.first+' '+b.last+' - '+b.primaryCo);
				// console.log(b.first+b.last);
				linkedInStyles.append('[data-name="'+b.first+b.last+'"] .linkedin, #overlay-whos-who-details [data-name="'+b.first+b.last+'"] .linkedin {display:block;}');
			}
		});
	}

	$.each(linkedInConnections[0], function(a, b) {
		// console.log(b.company);
		compareData(b.company, b.first, b.last);
	});
}

$(document).ajaxComplete(function() {
	obj = $.parseJSON(data.responseText);
	loadData();
});