(function (exports){

  exports.fbApi = {};
  
  exports.fbApi.checkFbStatus = function() {
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
	exports.fbApi.getFbUser();
      } else if (response.status === 'not_authorized') {
	exports.fbApi.user = null;
      } else {
	window.fbApi.login();
	//exports.fbApi.user = null;
      }
    });
  };

  exports.fbApi.login = function() {
    FB.login(function(rsp) {
      if(rsp.status == "connected") {
	exports.fbApi.getFbUser();        
      }
    })
  };
	    

  exports.fbApi.getFbUser = function() {
    FB.api('/me?fields=picture,id,name', function(rsp) {
      exports.fbApi.user = rsp;
      console.log(rsp);
    });
  }
})(window);
