(function() {
    "use strict";

    window.PreziEditor = (function() {

        PreziEditor.init = function(){
            if (!window.PreziPlayer){
                return;
            }

            PreziPlayer.prototype.getObjects = function() {
                return this.sendMessage({
                    'action': 'request',
                    'data': ['getObjects']
                });
            };

            PreziPlayer.prototype.setWidth = function(objectId, value) {
                return this.sendMessage({
                    'action': 'present',
                    'data': ['setWidth', objectId, value]
                });
            };

            PreziPlayer.prototype.setText = function(objectId, value) {
                return this.sendMessage({
                    'action': 'present',
                    'data': ['setText', objectId, value]
                });
            };

            PreziPlayer.prototype.setImageUrl = function(objectId, url) {
                return this.sendMessage({
                    'action': 'present',
                    'data': ['setImageUrl', objectId, url]
                });
            };

            PreziPlayer.EVENT_OBJECT_QUERY_RESPONSE = 'response';
            PreziPlayer.EVENT_IMAGE_LOADED = 'imageLoaded';

            PreziPlayer.binded_methods.push('getObjects');
        };

        function PreziEditor(){
        }

        PreziEditor.init();

        return PreziPlayer;

    })();

})();