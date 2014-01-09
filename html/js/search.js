$('.datepicker').datepicker({
	format: "dd MM yyyy"
});
//mantiene il dropdown aperto pur cliccando sul calendario
$(document).on('click', '.day, .month, .year, .dow, .datepicker-switch, .next, .prev', function (e) {
	console.log("porcodio");
    e.stopPropagation();
});
//Chiude calendario quando si clicca sul giorno
$(document).on('click','.day', function(){
	$('.datepicker-dropdown').fadeOut();
});
