// (function () {
// 	var data = $.getJSON("assets/js/whoswho.json");

// 	var obj, names;
// 	$(document).ajaxComplete(function() {
// 		obj = $.parseJSON(data.responseText);

// 		$.each(obj.whoswho, function(i, whoswho) {
// 			var person = '<li><div class="photo"><img src="assets/im/media/Corno_Jim.jpg" height="100" width="83" alt="id" /></div><h2>'+ whoswho.first + ' <span>' + whoswho.middle + ' ' + whoswho.last +'</span></h2><dl><dt>Primary Company</dt><dd>'+ whoswho.primaryCo +'</dd><dt>Secondary Company</dt><dd>'+ whoswho.secondaryCo +'</dd><dt>Professional Associations</dt><dd>'+ whoswho.profAssociations +'</dd><dt>Civic Affiliations</dt><dd>'+ whoswho.civicAffilliations +'</dd><dt>Industry</dt><dd>'+ whoswho.industry +'</dd><dt>Undergraduate College</dt><dd>'+ whoswho.undergraduate +'</dd><dt>Graduate College</dt><dd>'+ whoswho.graduate +'</dd><dt>Home Town</dt><dd>'+ whoswho.hometown +' '+ whoswho.state +'</dd><dt>Biography</dt><dd><a href="'+ whoswho.url +'" target="_blank">Click here</a></dd></dl></li>';
// 			$('ul').append(person);
// 		});
// 	});

// })();