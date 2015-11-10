/*
	//chmando o plugin
	$('#wrapper').trace();
	
	//chamando o plugin e passando alguns parametros
	$("#div").trace({message:'Mensagem teste', width : 400, height:500});
	
	//remove plugin
	$('#wrapper').trace('destroy');
	
	//thanks for the code
	// http://elmicox.blogspot.com.br/2008/07/drag-and-drop-mover-e-arrastar-divs-e.html
	//http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx
*/

//

(function(window, $){
	
	//
	var defaults =	{
		message					: 'Mensagem',
		width 					: 200,
		height 					: 200
	};
	
	//
	$.fn.trace = function( method ){
		// Method calling logic
		if ( methods[method] ){//caso exista um método, esse método é chamado
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof method === 'object' || ! method ){//caso não exista um método ou seja apenas passado o objeto
			return methods.init.apply( this, arguments );
		}
		else{//caso o método não exista
		  $.error( 'Method ' +  method + ' does not exist on jQuery.trace' );
		}    
	};
	
	var methods = {
		init 						:										function( options ){ 			return this.each(function(){	_init(this, options);});},
		destroy 					:										function( options ){ 			return this.each(function(){	_destroy();});}
	};

	function _init($this, _options) {
		var _options 					= $.extend(defaults, _options);
		
		var _message 					= _options.message;
		var _width						= parseInt(_options.width);
		var _height						= parseInt(_options.height);
		var _he 						= 25;
		var w_w							= _width - 10;
		var w_h 						= _height - 50;
		
		var _p = '<p style=" color:#666; font-size:13px; font-family:Arial, Helvetica, sans-serif; font-weight:100; font-style:normal;">'+_message+'</p>';
		var _trace = '<div class="trace" id="wrapper-trace" style="width:'+_width+'px; height:'+_height+'px; border:1px solid #999; position:fixed; z-index:1000; background-color:#FFFFFF;"><div id="header-trace" class="header-trace" style="height:'+_he+'px; border:1px solid #CCC; background-color:#CCC; cursor:move;"><a id="button-trace" style=" cursor:pointer; color:#333; font-weight:600; font-size:12px; text-decoration:none; font-style:normal; display:block; text-align:center; width:25px; float:right; margin:5px 0 0 0; font-family:Arial, Helvetica, sans-serif !important;">X</a><div></div style="clear:both !important; float:none !important; margin:0px !important; padding:0px !important; height:0px !important; width:0px !important"></div><div class="wrapper-trace" style=" overflow:auto; width:'+w_w+'px; height:'+w_h+'px; margin:10px 0 0 10px;">'+_p+'</div></div>';

		if($('.trace').length == 0){
			$('body').prepend(_trace);
		}
		else{
			$('.wrapper-trace').prepend(_p);
		}
		
		_callDrag($this);
		
		$('#button-trace').click(function(){	_destroy()});

	}//end init
	
	function _destroy(){
		$('.trace').remove();
	}
	
	function _callDrag($this){
		var target = null;
		var mouseOffset = null;
		var local_click = 'header-trace';
		var caixa_movida = 'wrapper-trace';
				
		if(local_click.constructor==String){ local_click = document.getElementById(local_click);}
		if(caixa_movida.constructor==String){ caixa_movida = document.getElementById(caixa_movida);}
			
		if(!caixa_movida.style.position || caixa_movida.style.position=='static'){
			caixa_movida.style.position='relative'
		}
		
		local_click.onmousedown = function(ev) {
			target = caixa_movida;        
			mouseOffset = _getPosition(target, ev);
			
			//
			document.body.focus();
			// prevent text selection in IE 
			//document.onselectstart = function () { return false; };
			
			return false;
		};//end onmousedown
		
		document.onmouseup = function() {
			target = null;
		}//end onmouseup
		
		document.onmousemove = function(ev) {
			if (target) {
				var ev = ev || window.event;
				var mousePos = _mouseCoords(ev);
				var pai = target.parentNode;
				target.style.left = (mousePos.x - mouseOffset.x - pai.offsetLeft) + 'px';
				target.style.top = (mousePos.y - mouseOffset.y - pai.offsetTop) + 'px';
				target.style.margin = '0px';
				return false;
			}
		}//end onmousemove
	}//end call drag
	
	function _mouseCoords(ev){    
		if(typeof(ev.pageX)!=="undefined"){
		  return {x:ev.pageX, y:ev.pageY};
		}else{
			return {
			  x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
			  y:ev.clientY + document.body.scrollTop  - document.body.clientTop
			};
		}
	}//end _mouseCoords
	
	function _getPosition(e, ev){
		var ev = ev || window.event;
		if(e.constructor==String){ e = document.getElementById(e);}
		var left = 0, top  = 0;    
		var coords = _mouseCoords(ev);    
	
		while (e.offsetParent){
		  left += e.offsetLeft;
		  top  += e.offsetTop;
		  e     = e.offsetParent;
		}
		left += e.offsetLeft;
		top  += e.offsetTop;
		return {x: coords.x - left, y: coords.y - top};
	}//end _getPosition
})(window, jQuery);