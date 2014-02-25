/**
 * Error alert
 * @param error Error message
 */
function errorAlert(error){
	var msgObj = new Object();
	msgObj.msg = error;
	msgObj.type = "error";
	handleMsg(msgObj);
	
}

/**
 * Success alert
 * @param msg Success message
 */
function successAlert(msg){
	var msgObj = new Object();
	msgObj.msg = msg;
	msgObj.type = "success";
	handleMsg(msgObj);
}

function handleMsg(msgObj){
	$.noty.consumeAlert({layout: 'bottomLeft', type: msgObj.type, dismissQueue: true, timeout: 5000});
	alert(msgObj.msg);
	$.noty.stopConsumeAlert();
}
