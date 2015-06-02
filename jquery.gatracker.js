// gaTracker: jQuery Google Analytics Integration
// A quicker, automated way to embed Google Analytics.
// (c)2007 Jason Huck/Core Five Creative
// (c)2008 Thomas Harning Jr/TrustBearer Labs
//
// Changes: Thomas Harning Jr: Uses ga.js and new action API
//          Thomas Harning Jr: Fix for Safari's delay
// Requires jQuery 1.2.x or higher (for cross-domain $.getScript)


(function($){
	$.gaTracker = function(code, opts){
		opts = jQuery.extend({
			extensions: [
					'pdf','doc','xls','csv','jpg','gif', 'mp3',
					'swf','txt','ppt','zip','gz','dmg','xml'		
			]	
		}, opts);
		
		// Returns the given URL's action-type if it is:
		//		a) a link to an external site -> external
		//		b) a mailto link              -> mailto
		//		c) a downloadable file        -> download
		// ...otherwise returns nothing
		function decorateLink(u){
			if(u.indexOf('://') == -1 && u.indexOf('mailto:') != 0){
				// no protocol or mailto - internal link - check extension
				var ext = u.split('.')[u.split('.').length - 1];			
				var exts = opts.extensions;
				
				for(i = 0; i < exts.length; i++){
					if(ext == exts[i]){
						return "download";
					}
				}				
			} else {
				if(u.indexOf('mailto:') == 0){
					return "mailto";
				} else {
					return "external";
				}
			}
		}
		
		// add tracking code to the current page
		function addTracking(){
			// Fix for Safari
			if(!window._gat) {
				var interval = setInterval(function() {
					if(!window._gat) return;
					clearInterval(interval);
					addTracking();
				}, 500);
			}
			var tracker = _gat._getTracker(code);
			tracker._initData();
			tracker._trackPageview();

			// examine every link with an href in the page
			$('a[@href]').each(function(){
				var u = $(this).attr('href');
				if(!u) return; // Just in case its a blank
				var action = decorateLink(u);
				if(!action) return;
				// if it needs to be tracked manually,
				// bind a click event to call GA with
				// the decoration
				$(this).click(function(){
					tracker._trackEvent(action, "click", newLink);
				});
			});
		}
		
		// include the external GA script in try/catch to play nice
		function initGA(){
			try{
				// determine whether to include the normal or SSL version
				var gaURL = (location.protocol == 'https:') ? 'https://ssl' : 'http://www';
				gaURL += '.google-analytics.com/ga.js';
		
				// include the script
				$.getScript(gaURL, function(){
					addTracking();
				});
			} catch(err) {
				// log any failure
				if(window.console) console.log('Failed to load Google Analytics:' + err);
			}
		}
		
		initGA();
	}
})(jQuery);
