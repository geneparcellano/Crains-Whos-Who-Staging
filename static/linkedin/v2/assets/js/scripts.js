var myCompany,
	myConnections = [],
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

	IN.API.PeopleSearch()
		.fields("firstName", "lastName", "distance", "publicProfileUrl","pictureUrl","positions")
		// .params({"first-name": "Becky", "last-name": "Allen", "count": 10, "sort": "distance"})
		.params({"first-name": "jason", "last-name": "fried","company-name": "37signals", "count": 10})
		.result(function(result) {
		console.log(result);
		});

}


function applyData() {
	console.log(myCompany);
	console.log(myConnections);
	$.each(myConnections, function(i, info) {
		console.log(info.first + ' : ' +info.last);
	});
}


$(document).ajaxComplete(function() {
	obj = $.parseJSON(data.responseText);
	console.log(obj);
});