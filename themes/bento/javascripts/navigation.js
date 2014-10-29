$(function() {
    /*
     * Binds events between navigation links and corresponding dialogs.
     *
     * Although not technically the "best"* way to connect the dialog and it's corresponding
     * nav link, this code expects that the nav link will have a `aria-controls` attribute
     * that matches up to the dialogs ID.
     * [* Note: "best" in this context would be not hijacking aria attributes for code that isn't
     * strictly aria related (although I bet that could be debated)]
     *
     * Assumptions:
     *  - Navigation links have the class `js-navLink`
     *  - The dialog already has it's HTML on the page
     *  - Any element you want to close the page has a class of `js-closeDialog`
     *
     * Other notes
     *  - The modal container should have a alcas of `js-modalContainer` if you
     *    want the overlay to be dynamically resized to the size of the viewport
     */

    function NavigationDialogs() {
        var $navLinks = $('.js-navLink'), // All our navigation links
            $closeDialogButtons = $('.js-closeDialog'); // Any element that may want to close the dialog
            navigationDialogs = {
                /* Called when a new instance of `NavigationDialogs` is instantiated */
                init: function() {
                    this.bindEvents();
                },
                /* Binds any events onto the nav links and close action elements from above */
                bindEvents: function() {
                    // jQuery does weird shit with scope binding. Proxy what we actually want
                    // for scope here
                    var navLinkClickHandler = $.proxy( this.navLinkClickHandler, this ),
                        closeDialogClickHandler = $.proxy(this.closeDialogClickHandler, this);

                    $navLinks.on('click', navLinkClickHandler);
                    $closeDialogButtons.on('click', closeDialogClickHandler);
                },
                /* Handler for opening the navlink's dialogs. Also takes care of correclty setting
                   the aria selected state */
                navLinkClickHandler: function(event) {
                    // If the navLink is an anchor tag, make sure we don't follow the href
                    event.preventDefault();

                    var me = this,
                        target = event.target;

                    //Set the correct state on each of our nav items
                    $navLinks.each(function(index, link) {
                        if (link === target) {
                            me.showDialog(link);
                            me.setAriaSelectedState(link, true);
                        }  else {
                            me.setAriaSelectedState(link, false);
                        }
                    });
                },
                /* Takes care of closing the related dialog */
                closeDialogClickHandler: function(event) {
                    // If the close element is an anchor tag, make sure we don't follow the href
                    event.preventDefault();

                    var target = event.target;
                    this.hideDialog(target);
                },
                /* Shows our dialog and ensures that our dialog mask dimensions are set properly */
                showDialog: function(el) {
                    var section = $(el).attr('aria-controls');

                    if (section) {
                        $('#' + section).removeClass('u-hidden');
                    }

                    this.resetOverlayDimensions();
                },
                /* Hides our dialog */
                hideDialog: function(el) {
                    var section = $(el).attr('aria-controls');

                    if (section) {
                        $('#' + section).addClass('u-hidden');
                    }
                },
                /* CSS can be unreliable (i.e. reliable cross browser) so dinamically update the mask dimensions the
                   currently visible dialog. I'm not overly pleased with having to do with so if anyone knows of a
                   better way then we can totally change this*/
                resetOverlayDimensions: function() {
                    // Couldn't nicely get the overlay dimensions to play nice on a page larger than the viewport size.
                    // Hence, script
                    var $body,
                        $modalContainer = $('.js-modalContainer:visible');

                    if ($modalContainer) {
                        // Wait until we are actually going to do anything before grabbing the body via jQuery
                        $body = $('body');
                        $modalContainer.height($body.height());
                        $modalContainer.width($body.width());
                    }
                },
                /* Sets an elements aria selected state */
                setAriaSelectedState: function(el, state) {
                    $(el).attr('aria-selected', state);
                }

            };

        navigationDialogs.init();

        return navigationDialogs;
    }

    new NavigationDialogs();

});
