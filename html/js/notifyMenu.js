//nasconde i subType non correlati ai Type
$('#notifyType').on('change', function(){

	$('#notifySubType option:nth-child(1)').attr('selected', true);

	switch ($(this).val()) {
		case 'Problemi stradali':
			console.log("mannaggialamadonna")
			disableOption(1);	
			break;
		case 'Emergenze sanitarie':
			disableOption(2);
			break;
		case 'Reati':
			disableOption(3);
			break;
		case 'Problemi ambientali':
			disableOption(4);
			break;
		case 'Eventi pubblici':
			disableOption(5);
			break;
	}
});

//funzione che disabilita le opzioni
function disableOption(numType){
	switch(numType){
	case 1:
		console.log("porcodio")
		for (var i=7; i<=18; i++){
			$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
		}
		//riattivo option disattivate prima
		for (var i=2; i<=6; i++){
			$("#notifySubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 2:
	console.log("porcodio")
		for (var i=2; i<=18; i++){
			if (i!=7 && i!=8 && i!=9){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=7; i<=9; i++){
			$("#notifySubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 3:
		for (var i=2; i<=18; i++){
			if (i!=10 && i!=11){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=10; i<=11; i++){
			$("#notifySubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 4:
		for (var i=2; i<=18; i++){
			if (i!=12 && i!=13 && i!=14 && i!=15){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=12; i<=15; i++){
			$("#notifySubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	case 5:
		for (var i=2; i<=18; i++){
			if (i!=16 && i!=17 && i!=18){
				$("#notifySubType option:nth-child("+ i +")").prop('disabled', true);
			}
		}
		//riattivo option disattivate prima
		for (var i=16; i<=18; i++){
			$("#notifySubType option:nth-child("+ i +")").prop('disabled', false);
		}
	break;
	}	
}
