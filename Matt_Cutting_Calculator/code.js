/*---------------------------------------------------------------------------*/
/**********************GLOBAL VARIABLES***************************************/
/*---------------------------------------------------------------------------*/
	//PHOTO DIMENSIONS
	var photo_w;
	var photo_h;
	//MAT BOARD DIMENSIONS
	var mat_w;
	var mat_h;
	//OVERMAT
	var overmat_bool;
	var overmat_offset;
	var overmat_color;
	var overmat_weight;
	//UNDERMAT
	var undermat_offset;
	var undermat_color;
	var undermat_weight;
	
	//#DEFINE VARIABLES

/*---------------------------------------------------------------------------*/
/*********************END GLOBAL VARIABLES************************************/
/*---------------------------------------------------------------------------*/
/**********************MAJOR FUNCTIONS****************************************/
/*---------------------------------------------------------------------------*/

function apply_form() {
	console.debug("apply Form");
	/*Print all the values in the Form*/
	update_from_side_form();
	
	/*Over mat Dimensions*/
	var overmat 			= document.getElementById('overmat');
    var overmat_style 		= window.getComputedStyle(overmat);
	var overmat_width 		= parseFloat(overmat_style.getPropertyValue('width'),10);
	var overmat_height 		= parseFloat(overmat_style.getPropertyValue('height'),10);
	
	/*Under mat Dimensions*/
	var undermat 			= document.getElementById('undermat');
	var undermat_style 		= window.getComputedStyle(undermat);
	
	/*Workspace*/
	var workspace 			= document.getElementById('work_space');
	var style_workspacce	= window.getComputedStyle(workspace);
	
	var workspace_height 	= parseInt(style_workspacce.getPropertyValue('height'),10);
	var workspace_width 	= parseInt(style_workspacce.getPropertyValue('width'),10);
	
	var overmat_total_offset = parseFloat(overmat_offset,10) + parseFloat(undermat_offset,10);
	console.debug("Undermat Offset: "+ undermat_offset+"Over Matt Offset "+ overmat_offset + "Total OFffset " + overmat_total_offset);
	
	var ppi;
	/*Caculations*/
	ppi 					= get_ppi(mat_h, mat_w);
	
	//The Format is this: (Photo Height - Undermat Offset) + overmat offset
	// EG 10 photo height, .25 undermat offset, .5 overmatt offset is
	// 10-.25 (9.75) + .5 = 10.25
	overmat.style.height 	= (	((photo_h	 - undermat_offset)	* ppi) 	+	(overmat_offset*ppi)	) + "px";
	overmat.style.width 	= (		((photo_w	 - undermat_offset) * ppi)	+	(overmat_offset*ppi)	) + "px";
	
	overmat.style.borderRightWidth	= (	(	mat_w -	(	(photo_w	 - undermat_offset) 	+ overmat_offset))	/2	)	*ppi +"px";
	overmat.style.borderLeftWidth	= (	(	mat_w -	(	(photo_w	 - undermat_offset) 	+ overmat_offset))	/2	)	*ppi +"px";
	overmat.style.borderTopWidth 	= (	(	mat_h -	(	(photo_h	 - undermat_offset) 	+ overmat_offset))	/2	)	*ppi +"px";
	overmat.style.borderBottomWidth = (	(	mat_h -	(	(photo_h	 - undermat_offset) 	+ overmat_offset))	/2	)	*ppi +"px";
	
	undermat.style.height 			= ((	photo_h * ppi)	-	(undermat_offset*ppi)) + "px";
	undermat.style.width 			= ((	photo_w * ppi)	-	(undermat_offset*ppi)) + "px";
	
	undermat.style.borderRightWidth	= ((mat_w -	(photo_w 	- undermat_offset))	/2)	*ppi +"px";
	undermat.style.borderLeftWidth	= ((mat_w -	(photo_w 	- undermat_offset))	/2)	*ppi +"px";
	undermat.style.borderTopWidth 	= ((mat_h -	(photo_h 	- undermat_offset))	/2)	*ppi +"px";
	undermat.style.borderBottomWidth = ((mat_h -(photo_h 	- undermat_offset))	/2)	*ppi +"px";
	
	//overmat.style.borderColor = overmat_color;
	overmat_checkbox();
	undermat.style.borderColor = undermat_color;
	
	undermat.style.borderStyle = "solid";
	overmat.style.borderStyle = "solid";
	
	/*Center the mats*/
	center_mat();
	set_right_ruler();
}

/**********************************FORMATTING**********************************
RULER UPDATE FUNCTION 
	This function is designed to set the values of the rulers
	
                 FRAME DIAGRAM
	 _______________________________________  < END
	|										|
	|	_________________________________   |
	|  | 							     | 	| <OVERMAT END
	|  |   ___________________________   |  |
	|  |  |							  |  |	| < UNDERMAT END
	|  |  |							  |  |	|
	|  |  |							  |  |	|
	|  |  |							  |  |	|
	|  |  |							  |  |	|
	|  |  |							  |  |	|
	|  |  |							  |  |	|
	|  |  |							  |  |	|
	|  |  |							  |  |	|
	|  |  |							  |  |	|
	|  |  |							  |  |	|
	|  |  |___________________________|  |  | < UNDERMAT START
	|  | 							     | 	|	
	|  |_________________________________|  | < OVERMAT START
	|										|
	|______________________________________	| < ORGIN

	^ ^ ^							    ^ ^ ^
	| | |_UNDERMAT END					| | |_ORGIN
	| |									| |
	| |_OVERMAT END						| |_OVERMAT START	
	|									|
	|_END								|_UNDERMAT START
	
All measurements are done in inches. In the United States we buy mat boards in inches
so we do the calculations in inches. But translate to mm requires you to simply ignore
the units and substitute your own.

Formatting the code:
>COMMENT OF LOCATION
	>SET LOCAL VAR: ELM_TEXT to working element
	>SET LOCAL VAR: ELM_IMG to working element
		#calculation of value
		#setting the value
		#
	

******************************************************************************/
function set_right_ruler(){
	console.debug("set_right_ruler "); //So we know where we are in debug
	update_from_side_form(); //We need these values to be saved to global memory so we update them
	/*Over mat Dimensions*/
	var overmat = document.getElementById('overmat');
    var overmat_style = window.getComputedStyle(overmat);
	
	var overmat_width = parseInt(overmat_style.getPropertyValue('width'),10);
	var overmat_height = parseInt(overmat_style.getPropertyValue('height'),10);
	/*Under mat Dimensions*/
	var undermat = document.getElementById('undermat');
	var undermat_style = window.getComputedStyle(undermat);
	
	/*Workspace*/
	var workspace = document.getElementById('work_space');
	var style_workspacce = window.getComputedStyle(workspace);
	
	var workspace_height = parseInt(style_workspacce.getPropertyValue('height'),10);
	var workspace_width = parseInt(style_workspacce.getPropertyValue('width'),10);
	
	var overmat_total_offset = parseInt(overmat_offset,10) + parseInt(undermat_offset,10);
	
	var ppi;
	
	ppi = get_ppi(mat_h, mat_w);
	
	var total_height_inches = workspace_height/ppi;
	var margin_height_pixels = (total_height_inches - mat_h) * ppi; 
	
	/*Top and Bottom Arrow dims*/
	//Technically these should have the exact same dimensions right now
	var right_ruler_elm_orgin_img = document.getElementById('height_orgin_img');  //We need these
	var right_ruler_elm_oend_img = document.getElementById('height_overmat_end_img'); //We need these
	
	var arrow_up_h = right_ruler_elm_orgin_img.getBoundingClientRect().height; //We assume the top is the same ast the start
	var arrow_up_w = right_ruler_elm_orgin_img.getBoundingClientRect().width;
	
	var arrow_down_h = right_ruler_elm_oend_img.getBoundingClientRect().height; //we assume the bottom is the same as the end
	var arrow_down_w = right_ruler_elm_oend_img.getBoundingClientRect().width;
	
	//Set the text Values for them here then set their offset
	

var ELM_TEXT;
var ELM_IMG;
var ELM_VALUE;	
	
/**BEGIN RIGHT SIDE MEASURMENTS**/	
/*__ORGIN__*/
	ELM_TEXT = document.getElementById('height_orgin');
	ELM_IMG = document.getElementById('height_orgin_img');
		//NO VALUE CACUALTION FOR ORGIN
		ELM_TEXT.innerHTML = '0"';
		ELM_TEXT.style.bottom = ((margin_height_pixels/2)+ (arrow_up_h*.1)) + "px";
		ELM_TEXT.style.left = (arrow_up_w*.35) + "px";
		ELM_IMG.style.bottom = ((margin_height_pixels/2)) + "px";
/*__OVERMAT START__*/
	ELM_TEXT = document.getElementById('height_overmat_start');
	ELM_IMG = document.getElementById('height_overmat_start_img');
		ELM_VALUE = ((mat_h - photo_h)/2)- ((undermat_offset/2) - (overmat_offset/2));   //this is in inches btw
		console.debug("ELM_VALUE Value is: "+ELM_VALUE);
		ELM_TEXT.innerHTML = '' +ELM_VALUE+'"';
		ELM_TEXT.style.bottom = (((margin_height_pixels/2) + ELM_VALUE*ppi)- (ELM_TEXT.getBoundingClientRect().height/2)*2) + "px";
		ELM_TEXT.style.left = ((ELM_IMG.getBoundingClientRect().width*.35) + "px");
		ELM_IMG.style.bottom = (((margin_height_pixels/2) + ELM_VALUE*ppi)- (ELM_IMG.getBoundingClientRect().height)) + "px";	
/*__UNDERMAT START__*/
	ELM_TEXT = document.getElementById('height_undermat_start');
	ELM_IMG = document.getElementById('height_undermat_start_img');
		ELM_VALUE = ((mat_h - (photo_h - undermat_offset))/2);   //this is in inches btw
		ELM_TEXT.innerHTML = '' +ELM_VALUE+'"';
		ELM_TEXT.style.bottom = (((margin_height_pixels/2) + ELM_VALUE*ppi)- (ELM_TEXT.getBoundingClientRect().height*.1)) + "px";
		ELM_TEXT.style.left = ((ELM_IMG.getBoundingClientRect().width*.35)) + "px";
		ELM_IMG.style.bottom = (((margin_height_pixels/2) + ELM_VALUE*ppi)) + "px";	
/*__UNDERMAT END__*/
	ELM_TEXT = document.getElementById('height_undermat_end');
	ELM_IMG = document.getElementById('height_undermat_end_img');
		ELM_VALUE = mat_h - ((mat_h - photo_h)/2)- (undermat_offset/2);   //this is in inches btw
		ELM_TEXT.innerHTML = '' +ELM_VALUE+ '"';
		ELM_TEXT.style.bottom = (((margin_height_pixels/2) + ELM_VALUE*ppi) - (ELM_TEXT.getBoundingClientRect().height)) + "px";	ELM_TEXT.style.left = ((ELM_IMG.getBoundingClientRect().width)*.35) + "px";
		ELM_IMG.style.bottom = (((margin_height_pixels/2) + ELM_VALUE*ppi)- (ELM_IMG.getBoundingClientRect().height)) + "px";	
/*__OVERMAT END__*/	
	ELM_TEXT = document.getElementById('height_overmat_end');
	ELM_IMG = document.getElementById('height_overmat_end_img');
		ELM_VALUE = mat_h - ((mat_h - photo_h)/2)- ((undermat_offset/2) - (overmat_offset/2));   //this is in inches btw
		ELM_TEXT.innerHTML = '' +ELM_VALUE+ '"';
		ELM_TEXT.style.bottom = (((margin_height_pixels/2) + ELM_VALUE*ppi)+ (ELM_TEXT.getBoundingClientRect().height)*.1) + "px";
		ELM_TEXT.style.left = (ELM_IMG.getBoundingClientRect().width*.35) + "px";
		ELM_IMG.style.bottom = (((margin_height_pixels/2) + ELM_VALUE*ppi)) + "px";
/*__END__*/
	ELM_TEXT = document.getElementById('height_limit');
	ELM_IMG = document.getElementById('height_limit_img');
		//NO VALUE CACUALTION FOR END
		ELM_TEXT.innerHTML ='' + mat_h + '"';
		ELM_TEXT.style.bottom = (workspace_height -(margin_height_pixels/2)- (ELM_TEXT.getBoundingClientRect().height)) + "px";
		ELM_TEXT.style.left = (ELM_IMG.getBoundingClientRect().width *.35) + "px";
		ELM_IMG.style.bottom = (workspace_height -(margin_height_pixels/2)- (ELM_IMG.getBoundingClientRect().height)) + "px";

/**BEGIN BOTTOM SIDE MEASURMENTS**/	
/*__ORGIN__*/
/*__OVERMAT START__*/	
/*__UNDERMAT START__*/	
/*__UNDERMAT END__*/	
/*__OVERMAT END__*/	
/*__END__*/		

}

function center_mat() {
	console.debug("center_mat");
	
	var overmat = document.getElementById('overmat');
	var undermat = document.getElementById('undermat');
	
    var overmat_style = window.getComputedStyle(overmat);
	var undermat_style = window.getComputedStyle(undermat);
	
    var overmat_width = parseInt(overmat_style.getPropertyValue('width'),10)
	var overmat_height = parseInt(overmat_style.getPropertyValue('height'),10)
	
	var undermat_width = parseInt(undermat_style.getPropertyValue('width'),10)
	var undermat_height = parseInt(undermat_style.getPropertyValue('height'),10)
	var undermat_border_left = parseInt(undermat_style.getPropertyValue('border-left-width'),10);
	var undermat_border_top = parseInt(undermat_style.getPropertyValue('border-top-width'),10);
	
	var undermat_left_offset = (-1 * undermat_border_left) - (undermat_width/2) + (overmat_width/2);
	//console.debug("Left Offset= "+undermat_left_offset);
	
	var undermat_top_offset = (-1 * undermat_border_top) - (undermat_height/2) + (overmat_height/2);
	//console.debug("Top Offset= "+undermat_top_offset);
	
	undermat.style.left = undermat_left_offset + "px" //set CSS shadow for "mydiv"
	undermat.style.top = undermat_top_offset + "px" //set CSS shadow for "mydiv"
}
	
	
/*---------------------------------------------------------------------------*/	
/*********************END MAJOR FUNCTIONS*************************************/
/*---------------------------------------------------------------------------*/
/**********************HELPER FUNCTIONS***************************************/
/*---------------------------------------------------------------------------*/

function update_from_side_form() {
	var side_form = document.getElementById('sidebar_form');
	
	photo_w = side_form.elements[0].value;
	photo_h = side_form.elements[1].value;
	mat_w = side_form.elements[2].value;
	mat_h = side_form.elements[3].value;
	overmat_bool = side_form.elements[4].checked;
	overmat_offset = parseFloat(side_form.elements[5].value);
	overmat_color = side_form.elements[6].value;
	overmat_weight = side_form.elements[7].value;
	undermat_offset = parseFloat(side_form.elements[8].value);
	undermat_color = side_form.elements[9].value;
	undermat_weight = side_form.elements[10].value;
}

function update_to_side_form() {

	var side_form = document.getElementById('sidebar_form');
	
	side_form.elements[0].value = photo_w;
	side_form.elements[1].value = photo_h;
	side_form.elements[2].value = mat_w;
	side_form.elements[3].value = mat_h;
	side_form.elements[4].value = overmat_bool;
	side_form.elements[5].value = overmat_offset;
	side_form.elements[6].value = overmat_color;
	side_form.elements[7].value = overmat_weight;
	side_form.elements[8].value = undermat_offset;
	side_form.elements[9].value = undermat_color;
	side_form.elements[10].value = undermat_weight;
}

function read_form() {
	/*Print all the values in the Form*/
	console.debug("Read_form");
	var side_form = document.getElementById('sidebar_form');
	var form_len = side_form.elements.length;
	for (var i = 0; i < form_len; i++)
	{
		console.debug("Value in form at: " + i + " contains " + side_form.elements[i].value);
	}
}

function get_ppi( mat_height,  mat_width){

	/*Workspace*/
	var workspace = document.getElementById('work_space');
	var style_workspacce = window.getComputedStyle(workspace);
	
	var workspace_height = parseInt(style_workspacce.getPropertyValue('height'),10);
	var workspace_width = parseInt(style_workspacce.getPropertyValue('width'),10);
	
	if( (mat_width > mat_height)  ) { /*Width is larger: we are landscape*/
	
		ppi = (workspace_width * 0.8)/mat_width;
		
		if((ppi*mat_height)>(workspace_height*0.8)) { /*We need to make sure it fits*/
			ppi = (workspace_height * 0.8)/mat_height;
		}
	
	} else{ /*Height is larger: we are portrait*/
	
		ppi = (workspace_height * 0.8)/mat_height;
	
		if((ppi*mat_height)>(workspace_width*0.8)) { /*We need to make sure it fits*/
			ppi = (workspace_height * 0.8)/mat_width;
		}
	
		console.debug("apply Form PPI:" + ppi);
	}
	
	return ppi;
}

function overmat_checkbox() {
	
	update_from_side_form(); //We need to make sure we pull from the latest value
	
	console.debug("TOGGLEt= "+overmat_bool);
	
	if(overmat_bool) {
		overmat.style.borderColor= overmat_color;
	}else {
		overmat.style.borderColor= undermat_color;
	}
}

/*---------------------------------------------------------------------------*/	
/*********************END HELPER FUNCTIONS************************************/
/*---------------------------------------------------------------------------*/



/*******************FORM UPDATE VALUE CHECK Function***************************
	These functions are designed to make sure the input in the form is kept
	at a valid range so the display will work. The rule needs to be to only*
	limit impossible values
******************************************************************************/

/*Width Checks*/
function photo_width_change() {
	var side_form = document.getElementById('sidebar_form');
	var photo_w =  parseInt(side_form.elements[0].value,10);
	var mat_w =  parseInt(side_form.elements[2].value,10);
	
	if( photo_w >= mat_w) {
		alert ("The Photo Width Needs to be less then the Matt Width");
		side_form.elements[0].value = mat_w - (0.1*mat_w);
	}
	//The photo Width needs to be non negative
	if( photo_w <= 0) {
		alert ("The Photo Width Needs to be non zero");
		side_form.elements[0].value = 0.5*mat_w;
	}
	apply_form();
}

function photo_height_change() {
	var side_form = document.getElementById('sidebar_form');
	var photo_h =  parseInt(side_form.elements[1].value,10);
	var mat_h =  parseInt(side_form.elements[3].value,10);
	
	if( photo_h >= mat_h) {
		alert ("The Photo Height Needs to be less then the Matt Height");
		side_form.elements[1].value = mat_h - (0.1*mat_h);
	}
	//The photo Width needs to be non negative
	if( photo_h <= 0) {
		alert ("The Photo Height Needs to be non zero");
		side_form.elements[1].value = 0.5*mat_h;
	}
	apply_form();
}

function mat_width_change() {
	var side_form = document.getElementById('sidebar_form');
	var photo_w = parseInt(side_form.elements[0].value,10);
	var mat_w 	= parseInt(side_form.elements[2].value,10);
	console.debug(mat_w + " <= "+photo_w);
	if( mat_w <= photo_w) {
		alert ("The Mat Width Needs to be Greater then the Photo Width");
		side_form.elements[02].value = (1.25*photo_w);
	}
	//Lets check that it's non zero
	if( mat_w <= 0) {
		alert ("The Mat Width Needs to be Greater then 0");
		side_form.elements[02].value = (1.25*photo_w);
	}
	apply_form();
}

function mat_height_change() {
	var side_form = document.getElementById('sidebar_form');
	var photo_h =  parseInt(side_form.elements[1].value,10);
	var mat_h =  parseInt(side_form.elements[3].value,10);
	
	if( mat_h <= photo_h) {
		alert ("The Mat Height Needs to be greater then the Photo Height");
		side_form.elements[3].value = (1.25*photo_h);
	}
	//Lets check that it's non zero
	if( mat_h <= 0) {
		alert ("The Mat Height Needs to be greater then 0");
		side_form.elements[3].value = (1.25*photo_h);
	}
	apply_form();
}
/*Checkbox Behaviour*/
function overmat_checkbox() {
	console.debug("overmat_checkbox");
	var side_form = document.getElementById('sidebar_form');
	
	var overmat_bool = side_form.elements[4].checked;
	var overmat_color = side_form.elements[6].value;
	var undermat_color = side_form.elements[9].value;
	
	//console.debug("TOGGLEt= "+overmat_bool);
	
	if(overmat_bool) {
		overmat.style.borderColor= overmat_color;
		side_form.elements[5].disabled = false;
		side_form.elements[6].disabled = false;
		side_form.elements[7].disabled = false;
	}else {
		overmat.style.borderColor= undermat_color;
		side_form.elements[5].disabled = true;
		side_form.elements[6].disabled = true;
		side_form.elements[7].disabled = true;
	}
	
	var right_ruler_elm_ostart = document.getElementById('height_overmat_start');
	var right_ruler_elm_oend = document.getElementById('height_overmat_end');
	
	//If we have the over matt off, we should turn off the overmatt measurements
	if (overmat_bool){
		right_ruler_elm_ostart.style.visibility = "visible";
		right_ruler_elm_oend.style.visibility = "visible";
		//console.debug("visable ");
	} else {
		right_ruler_elm_ostart.style.visibility = "hidden";
		right_ruler_elm_oend.style.visibility = "hidden";
		//console.debug("hidden ");
	}
}

/*Color Checks*/

/*Offset Checks*/
function overmat_offset_change() {
	update_from_side_form(); //We need to make sure we pull from the latest value
	
	if( (overmat_offset >= (mat_h - photo_h)) || (overmat_offset >= (mat_w - photo_w)) ) {
		alert ("The overmat offset exceeds the mat size");
		overmat_offset = .1; //FIX THIS LATER needs to be half the lesser of the perious ones
	}
	//Lets check that it's non zero
	if( overmat_offset < 0) {
		alert ("The over mat offset needs to be non negative");
		overmat_offset = 0;
	}
	
	//Apply the changes
	update_to_side_form();
	apply_form();
}


function undermat_offset_change() {
	
	update_from_side_form(); //We need to make sure we pull from the latest value
	
	if( (undermat_offset >= (mat_h - photo_h)) || (undermat_offset >= (mat_w - photo_w)) ) {
		alert ("The Mat Height Needs to be greater then the Photo Height");
		undermat_offset = (.5 * (mat_h - photo_h)); 
	}
	//Lets check that it's non zero
	if( undermat_offset < 0) {
		alert ("The under mat offset needs to be non negative");
		undermat_offset = 0;
	}
	
	//APPLY THE CHANGES
	update_to_side_form();
	apply_form();
}


/*Weight Checks (HAES)*/
