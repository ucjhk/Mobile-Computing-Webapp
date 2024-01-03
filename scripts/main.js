/* Viewport Breite */
jQuery(document).ready(function () { 
	
	//////////////////////////////////////////////////////
	// Aktuelle Viewport-Breite anzeigen
	//////////////////////////////////////////////////////
	
	// neues Element als erstes im Body-Tag einfuegen, DIV-Element mit Attributen und Eventhandler erzeugen
	$( "body" ).prepend($('<div/>', { 'id': 'js-viewport-breitenanzeiger', 'text': 'Viewport: ' + $(window).width()/parseFloat($("body").css("font-size")) + ' em'}));
	
	//////////////////////////////////////////////////////
	// Event-Handler (beim Aendern der Fenstergroesse 
	// Viewport-Daten in DIV-Element-Textknoten schreiben) 
	//////////////////////////////////////////////////////
	$( window ).resize(function() { 
		$('#js-viewport-breitenanzeiger').text("Viewport: " + $(window).width()/parseFloat($("body").css("font-size")) + "em");
	});

});	