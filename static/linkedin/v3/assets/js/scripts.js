var myCompany,
	myConnections = [],
	connectionMatch = [],
	data = $.getJSON("assets/js/whoswho.json");

function loadData() {

	IN.API.Profile("me")
		.fields(["firstName","headline","positions:(company)"])
		.result(function(result) {
			myCompany = result.values[0].positions['values'][0].company['name'];
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

					myConnections.push(person);
				}
			});
			applyData();
		});

	// IN.API.PeopleSearch()
	// 	.fields("firstName", "lastName", "distance", "publicProfileUrl","pictureUrl","positions")
	// 	// .params({"first-name": "Becky", "last-name": "Allen", "count": 10, "sort": "distance"})
	// 	.params({"first-name": "jason", "last-name": "fried","company-name": "37signals", "count": 10})
	// 	.result(function(result) {
	// 	console.log(result);
	// 	});

}


function applyData() {
	var workConnections = [];
	$.each(myConnections, function(i, info) {
		if (info.company.indexOf(myCompany) !== -1) {
			var person = {};

			person['company'] = info.company;
			person['first'] = info.first;
			person['last'] = info.last;

			workConnections.push(person);
			// console.log(info.first + ' ' +info.last);
		}
	});

	myConnections.length = 0;
	myConnections.push(workConnections);
	// console.log(myCompany);
	console.log(myConnections);

	matchData();
}

function matchData() {
	function compareData(company, first, last) {
		$.each(obj.whoswho, function(a, b) {
			if (b.primaryCo === company && b.last === last && b.first === first) {
				console.log(b.first+' '+b.last+' - '+b.primaryCo);
			}
		});
	}

	$.each(myConnections[0], function(a, b) {
		// console.log(b.company);
		compareData(b.company, b.first, b.last);
	});
}

// function getResult(first, last, company) {
// 	// if (!IN.ENV.auth.oauth_token) {
// 	//   alert("You must login w/ LinkedIn to use the Search functionality!");
// 	//   return;
// 	// }
// 	console.log(first+' '+last+' - '+company);
// 	IN.API.PeopleSearch()
// 		.fields("firstName", "lastName", "distance", "publicProfileUrl","pictureUrl","positions")
// 		// .params({"first-name": "Becky", "last-name": "Allen", "count": 10, "sort": "distance"})
// 		.params({"first-name": first, "last-name": last,"company-name": company, "count": 10})
// 		.result(function(result) {
// 			console.log(result);
// 		});
// }

// function checkConnection() {	
// 	$.each(obj.whoswho, function(i, person) {
// 		getResult(person.first, person.last, person.primaryCo);
// 	});
// }

$(document).ajaxComplete(function() {
	obj = $.parseJSON(data.responseText);
	// console.log(obj);
	// checkConnection();
});