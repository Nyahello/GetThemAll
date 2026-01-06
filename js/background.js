// -------------------------------------------------------
const YOUTUBE_URL_SIGNS = [
		"//youtube.com",
		"//www.youtube.com",
		".youtube.com",
		"//soloset.net",
		"//www.soloset.net",
		"//solosing.com",
		"//www.solosing.com"
	];

function isYoutubeUrl(url){

	if ( GetThemAll.noYoutube == false ) return false;

	var url = url.toLowerCase();
		
	for( var i = 0; i != YOUTUBE_URL_SIGNS.length; i++ )  {
		if( url.indexOf( YOUTUBE_URL_SIGNS[i] ) != -1 )		return true;
	}
		
	return false;
}
	

window.addEventListener( "load", function(){

	GetThemAll.Media.init();

//	if( GetThemAll.Utils.isVersionChanged() && !GetThemAll.noWelcome )	{
//		var url = null;
//		
//		if (GetThemAll.Prefs.get("install_time") == 0) 	{
//			url = "填写首次安装欢迎页链接";
//		}
//		else {
//			
//		}	
//			
//		if( url )	{
//			chrome.tabs.create({
//						url: url,
//						active: true
//					});			
//		}
//
//	}
	
	if( GetThemAll.Prefs.get( "install_time" ) == 0 )	{
		GetThemAll.Prefs.set( "install_time", new Date().getTime() );
	}
		
//	chrome.runtime.setUninstallURL("填写卸载反馈链接");
	
	chrome.windows.getCurrent(function(window) 	 {
		GetThemAll.Media.widthWin = window.width;		
		chrome.tabs.getSelected(window.id, function(tab) {
			chrome.tabs.getZoom(tab.id, function( z ) {
				GetThemAll.Media.scaleZoom = z;
			});	
			chrome.tabs.getZoomSettings(tab.id, function( z ) {
				console.log(z);
			});	
		});
		
	});
	
 	chrome.tabs.onZoomChange.addListener(function (zz) {
		chrome.tabs.getZoomSettings(zz.tabId, function( z ) {
			GetThemAll.Media.scaleZoom = z.defaultZoomFactor;
		});	
	}); 
	chrome.i18n.getAcceptLanguages(function(languages){
		if ( languages.indexOf("ru") != -1 ) {
			GetThemAll.Media.localUser = 'ru';
		}
		else {
			GetThemAll.Prefs.set( 'gta.display_vk_button', false );
		}		
	});
	
	// --------------------------------------------------------------------------------
	chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
		
			if (request.akse == 'Page_Options') {
				
				var params = {};
				for (var i = 0; i != request.list.length; i++) 	{
					var v = GetThemAll.Prefs.get( request.list[i] );
					if (v == 'true')  v = true;
					else if (v == 'false')  v = false;
					params[ request.list[i] ] = v;
				}

				var message = {};
				for (var i = 0; i != request.msg.length; i++) 	{
					message[request.msg[i]] =  chrome.i18n.getMessage(request.msg[i]);
				}

				var addon = {};
				addon.id = chrome.i18n.getMessage("@@extension_id");
				addon.title = chrome.i18n.getMessage("appName");
				addon.description = chrome.i18n.getMessage("appDesc");
				
				sendResponse({paramsOptions: params,  paramsMessage: message,  paramsAddon: addon});
			}
			else if (request.akse == 'Save_Options') {
				
				for ( var k in request.params ) {
					GetThemAll.Prefs.set( k, request.params[k].toString() );
				}
				
				sendResponse({});
			}	
			else if (request.akse == 'Close_Options') {
				
				chrome.tabs.query( {
						active: true,
						currentWindow: true
					}, function( tabs ){
								if( tabs.length > 0 )	{
									chrome.tabs.remove(tabs[0].id);
								}
				} );
			}	
			else if (request.action == 'SettingOptions') {
				
				display_settings(  );
			}	
	});	
	
	chrome.tabs.query( {
			active: true,
			currentWindow: true
		}, function( tabs ){
					if( tabs.length > 0 )	{
						set_popup(tabs[0].id);
					}
	} );
	
}, false );

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (tab.status == 'complete') {
		set_popup(tabId);
	}
});
chrome.tabs.onActivated.addListener(function (tab) {
	set_popup(tab.tabId);
});
var set_popup = function (tabId, callback) {
	chrome.tabs.query( {
			active: true,
			currentWindow: true
		}, function( tabs ){
					if( tabs.length > 0 )	{
						for (var i=0; i<tabs.length; i++) {
							if (tabs[i].id == tabId) {	
							
								var url = tabs[i].url;
								var flag = true;
								if ( url.indexOf( 'chrome://' ) != -1 )  flag = false;
								
								if (flag) {
									chrome.browserAction.setPopup({ popup: 'popup.html' });	
								}
								else {	
									chrome.browserAction.setPopup({ popup: 'noload.html' });
								}
							
							}
						}	
					}
	} ); 
};

// ---------------------------------------- Options  --------------------------
function display_settings(  )  {

	chrome.tabs.query( 	{  }, function( tabs ){
		
					var myid = chrome.i18n.getMessage("@@extension_id");
		
					if( tabs.length > 0 )	{
						
						for (var i=0; i<tabs.length; i++) {
						
							if ( tabs[i].url.indexOf( "addon="+myid ) != -1 ) {	
								chrome.tabs.update( tabs[i].id, { active: true } );
								return;
							}
						}
						
						chrome.tabs.create( {	active: true,
												url: chrome.extension.getURL("/options.html")
											}, function( tab ){ }
										);
					}
	} );
}

// ----------------------------------------------
//navigateMessageDisabled = function(uri){
//	
//	var url = '填写网站链接';
//	
//	chrome.tabs.query( 	{  }, function( tabs ){
//		
//					if( tabs.length > 0 )	{
//						for (var i=0; i<tabs.length; i++) {
//							if ( tabs[i].url.indexOf( "/message-disabled/" ) != -1 ) {	
//								chrome.tabs.update( tabs[i].id, { active: true, url: url } );
//								return;
//							}
//						}
//						
//						chrome.tabs.create( {	active: true,
//												url: url
//											}, function( tab ){ });
//					}
//	} );
//	
//}

// --------------------------------------------------------
