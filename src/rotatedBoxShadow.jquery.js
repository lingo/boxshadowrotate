/* global jQuery, RotatedBoxShadow  */
'use strict';

if (typeof(jQuery) !== 'undefined') {
    jQuery.fn.rotatedBoxShadow = function(action) {

        return this.each(function() {
            var $this = jQuery(this)
            var inst = $this.data('_rotatedBoxShadow');
            if (inst) {
                if (!action) {
                    return; // NOP if no action
                }

                switch(action) {
                    case 'apply':
                        inst.apply();
                        return;
                    case 'reloadCSS':
                        inst.reloadCSS();
                        return;

                    default:
                        throw new Error('jquery rotatedBoxShadow: unknown method ' + action);
                }
            }
            $this.data('_rotatedBoxShadow', new RotatedBoxShadow(this));
        });
    };
}