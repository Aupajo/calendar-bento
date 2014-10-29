$(function() {
    /*
     * Takes care of all the checkbox events for when the user changes sources for the calendar. It has the
     * worst variable names ever, so sorry for that.
     *
     * There are two related set of events here; checking an individual source and updating the total count etc
     * as appropriate. The other is checking all/none of the checks if the total check checkbox is checked (try
     * saying that 10 times fast).
     *
     * Assumptions:
     * - All checks we want to track have a class of `js-sourceCheck`
     * - The total for a group of sources has the class `js-sourceTotalCount`
     * - The checkbox that can check all or none of the related sources has a class of `js-sourceTotalCheck
     * - There is also an HTML layout assumption
     *
     * Layout:
     * `.js-source` contains all event source checkboxes and the total counts and total check elements
     * `.js-sourceTotalCheck` checks/unchecks all event source checkboxes within the parent `.js-source`
     * `.js-sourceCheck` is the class give to all event sources
     */
    function SourceChecks() {
        var sources = [], // Our array of event source check information
            sourceChecks = {
                /* Called when a new instance of `SourceChecks` is instantiated */
                init: function() {
                    var sourceHolders = $('.js-source');

                    // For each group of sources, create a collection of related elements
                    sourceHolders.each(function(index, source) {
                        var $source = $(source),
                            $sourceTotalCheck = $source.find('.js-sourceTotalCheck'),
                            $sourceTotalCount = $source.find('.js-sourceTotalCount'),
                            $sourceChecks = $source.find('.js-sourceCheck');

                        sources.push({
                            totalCheck: $sourceTotalCheck,
                            totalCount: $sourceTotalCount,
                            sourceChecks: $sourceChecks
                        });

                    });

                    this.bindEvents();
                },
                /* Binds any events onto the elements contained within the `sources` array generated
                   in the `init()` function */
                bindEvents: function() {
                    var me = this,
                        onCheckChangeHandler = $.proxy(this.onCheckChangeHandler, this),
                        onTotalCheckChangeHander = $.proxy(this.onTotalCheckChangeHander, this);

                    sources.forEach(function(source)  {
                        // Deal with individual source checkboxes
                        $(source.sourceChecks).on('change', source, onCheckChangeHandler);
                        // Deal with checking/unchecking all related sources
                        $(source.totalCheck).on('change', source, onTotalCheckChangeHander);
                    });
                },
                /* Handler for the individual event source checkboxes */
                onCheckChangeHandler: function(event) {
                    var source = event.data, // Associated source object (contains related objects/elements)
                        totalChecks = source.sourceChecks.length, // How many sources are checked
                        totalChecksChecked = this.countChecked(source.sourceChecks); //Haha, what a funny variable name

                    if (totalChecks === totalChecksChecked) {
                        // Every source is checked. Also check the total checkbox and update label
                        source.totalCheck.prop('checked', true);
                        this.updateTotalCheckCount(null, source.totalCount, ['(All', totalChecks, 'selected)'].join(' '));
                    } else {
                        // Not all sources are checked. Ensure the total checkbox is unchecked and update label
                        source.totalCheck.prop('checked', false);
                        this.updateTotalCheckCount(null, source.totalCount, ['(', totalChecksChecked, 'of', totalChecks, 'selected)'].join(' '));
                    }
                },
                /* Handler for the total event source checkboxes */
                onTotalCheckChangeHander: function(event) {
                    var source = event.data, // Associated source object (contains related objects/elements)
                        shouldCheck = source.totalCheck.is(':checked');

                    source.totalCheck.prop('checked', shouldCheck);
                    source.sourceChecks.each(function() {
                        // Give all sources the same checked state as the total check
                        $(this).prop('checked', shouldCheck);
                    });

                    this.updateTotalCheckCount(source.sourceChecks, source.totalCount);
                },
                /* Given an array of checkbox elements, count how many are checked */
                countChecked: function(checkboxEls)  {
                    var checkboxArr = checkboxEls.toArray();

                    return checkboxArr.reduce(function(previousValue, currentValue, index) {
                         return $(currentValue).is(':checked') ? previousValue + 1 : previousValue
                    }, 0);
                },
                /* Update the relevant label with the correct text depending on how many checkboxes
                   in the `checks` argument are actually checked */
                updateTotalCheckCount: function(checks, totalCount, wording) {
                    if (wording) {
                        totalCount.text(wording);
                        return;
                    }

                    var totalChecks = checks.length,
                        totalChecksChecked = this.countChecked(checks);

                    if (totalChecks === totalChecksChecked) {
                        totalCount.text(['(All', totalChecks, 'selected)'].join(' '));
                    } else {
                        totalCount.text(['(', totalChecksChecked, 'of', totalChecks, 'selected)'].join(' '));
                    }
                }
            };

        sourceChecks.init();

        return sourceChecks;
    }

    new SourceChecks();

});
