(function () {
	var data = $.getJSON("assets/js/whoswho.json");

	var obj, names;
	$(document).ajaxComplete(function() {
		obj = $.parseJSON(data.responseText);

		// var names = [];
		$.each(obj.whoswho, function(i, whoswho) {
			// names.push(whoswho.first + ' ' + whoswho.middle + ' ' + whoswho.last);
			var fullName = '<li><h2>'+ i +' '+ whoswho.first + ' ' + whoswho.middle + ' ' + whoswho.last +'</h2><dl><dt>Primary Company</dt><dd>'+ whoswho.primaryCo +'</dd><dt>Secondary Company</dt><dd>'+ whoswho.secondaryCo +'</dd><dt>Professional Associations</dt><dd>'+ whoswho.profAssociations +'</dd><dt>Civic Affiliations</dt><dd>'+ whoswho.civicAffilliations +'</dd><dt>Industry</dt><dd>'+ whoswho.industry +'</dd><dt>Undergraduate College</dt><dd>'+ whoswho.undergraduate +'</dd><dt>Graduate College</dt><dd>'+ whoswho.graduate +'</dd><dt>Home Town</dt><dd>'+ whoswho.hometown +' '+ whoswho.state +'</dd><dt>Biography</dt><dd><a href="'+ whoswho.url +'">Click here</a></dd></dl></li>';
			$('ul').append(fullName);
		});
		// console.log(names);

		// $('.typeahead').attr('data-source','[' + names + ']');

		// $('button').on('click', function(e) {
		// 	var searchValue = $('input').val().toLowerCase(),
		// 		info;

		// 	$('#result').hide().children().remove();

		// 	$.each(obj.icons, function(i, icons) {
		// 		if (icons.name.toLowerCase().indexOf(searchValue) !== -1) {
		// 			var info = '<ul><li><img src="' + icons.location + '" alt="'+ icons.name +'" /></li><li>Name: <strong>'+ icons.name +'</strong></li><li>File Size: <strong>'+ icons.size +'</strong></li><li>Height: <strong>'+ icons.height +'</strong></li><li>Width: <strong>'+ icons.width +'</strong></li><li>Location: <strong>'+ icons.location +'</strong></li><li>Last Modified: <strong>'+ icons.modified +'</strong></li></ul>';
		// 			$('#result').append(info).fadeIn();
		// 		}
		// 	});

		// });

	});

})();