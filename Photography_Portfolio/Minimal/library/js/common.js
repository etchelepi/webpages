var carousel = (function(){

    var container = document.getElementById('carousel'),
        items = container.getElementsByTagName('figure')[0];
    var active = 0, // the active item (sits far left)
        properties = {}, // used to calculate scroll distance
        animating = false; // whether the carousel is currently animating
		
	var vpWidth = document.documentElement.clientWidth, 
    vpHeight = document.documentElement.clientHeight;
	
    console.debug(vpWidth + "x" + vpHeight);
	
    // use Modernizr.prefixed to get the prefixed version of boxOrdinalGroup
    var boxOrdinalGroup = Modernizr.prefixed( 'boxOrdinalGroup' );

    // list of the end event names in different browser implementations
    var transEndEventNames = {
           'WebkitTransition' : 'webkitTransitionEnd',
           'MozTransition'    : 'transitionend',
           'OTransition'      : 'oTransitionEnd',
           'msTransition'     : 'MsTransitionEnd',
           'transition'       : 'transitionend'
        };

    // use Modernizr.prefixed to work out which one we need
    var transitionEnd = transEndEventNames[ Modernizr.prefixed('transition') ];

/******************************************************************************
Function Name: Style
Details: This function starts by styling the images so they have the right 
margin and visibility
******************************************************************************/
function init_style() {
    // start at the item BEFORE the active one.
	var len = container.children.length ;
	var x = items;
    for(var index = 0; index < len; index++)
	{
		//console.debug("THE SETUP LOOP " + index);
		
		var item = container.children[index];
		
		var padding_width = parseInt(window.getComputedStyle(item, null).getPropertyValue('padding-left'));
		var item_width = parseInt(window.getComputedStyle(item, null).getPropertyValue('width'));
		var new_margin = (vpWidth - (item_width))/2;
		item.style.order = index;
        item.style.marginRight = new_margin+"px";
		item.style.marginLeft = new_margin+"px";
		//console.debug("Total Width: : "+ vpWidth +" "+ item_width);
		//console.debug("Total Width: : "+ properties.width);
		//console.debug("MARGIN MOVE: "+ new_margin);
		//console.debug("PADDING MOVE: "+ padding_width);	
    }
}
function change_ordinal(e)
{
    e.preventDefault(); // prevent the click action
	if (!animating) {
		animating = true;
		
		var target = e.target || e.srcElement;	
		var item; //variable we will use for the figures
		var len = container.children.length;//Find the length of elements
		var next = target.classList.contains( 'next' );// find out if we are moving next or previous based on class
		container.classList.add( 'animate' );// allow our carousel to animate
		
		if (next) {
			if ( active < len - 1 ) {
				active++;
			} else {
				active = 0;
			}
		} else {
			if ( active > 0 ) {
				active--;
			} else {
				active = len - 1;
			}
		}
		
		for(var index = 0; index < len; index++)
		{
			item = container.children[index];
			item.style.order = ((len-active)+index)%len;
		}
    }
	animating = false; //This is for adding animation later
}

/******************************************************************************
Function Name: init
Details: This function runs when we load the iframe to allow the user to navigate
******************************************************************************/
    return {
        init: function() {

            var navigation = document.querySelectorAll( 'a.navigation' );
            var length = navigation.length;
            var i = 0;
			
			init_style(); //Lets style the page to fit before we start

            while (i < length) {
                navigation[i].addEventListener( 'click' , change_ordinal );// add an event listener to each navigation item
                i++;
            }
            // event listener for end of a transition
            //container.addEventListener( transitionEnd, complete );

            // get initial width and margin
            if (items.children.length > 0) {
                    
                var itemStyle = window.getComputedStyle( items.children[0], null ) || items.children[0].currentStyle;
                
                properties = {
                    width: parseInt( itemStyle.getPropertyValue( 'width' ), 10 ),
                    marginRight: parseInt( itemStyle.getPropertyValue( 'margin-right' ), 10 )
                };

            }
            // set the initial ordinal values
            //changeOrdinal();

        }()

    }


})();

