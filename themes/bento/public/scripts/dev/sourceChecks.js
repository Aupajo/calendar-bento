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
     * - There is a base 'template' in the DOM with an id of `sourceTemplate` and where the generated elements
     *   are to be inserted is inside an element with the id `sourceTemplateContainer`
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
                    this.createCheckHtml();
                    this.populateSourceArray();
                    this.bindEvents();
                    this.sourceColumnSetup();
                },
                /*
                 * Creates the source checkbox templates based on a 'template' in the dom. Simply grabs the
                 * template html, replaces a couple of handlebar-like strings, and inserts a new dom node.
                 *
                 * Note: we could have used a proper FE template engine here but I can't see the benefit yet
                 * of adding that overhead for this single use
                 */
                createCheckHtml: function() {
                    /* Creates a camelCase version of the string that is passed through */
                    function formatName(name) {
                        var returnText = "";
                        for (var i = 0, len = name.length; i < len; i++) {
                            var c = name[i];
                            if (c === ' ') {
                                // Capitalise the next character and ignore the space
                                i++;
                                try {
                                    c = name[i].toUpperCase();
                                } catch(e) {
                                    continue;
                                }
                            }
                            returnText += c;
                        }
                        return returnText;
                    }

                    var $container = $('#sourceTemplateContainer'),
                        $template = $('#sourceTemplate'),
                        templateHtml = $template.html();

                    window.CAL.eventSources.forEach(function(cal) {
                        // Make sure we have something to work with here
                        if (!cal.name) {
                            return;
                        }
                        var sourceHtml = templateHtml.replace(/{{name}}/g, cal.name)
                            .replace(/{{formattedName}}/g, formatName(cal.name));
                        $container.append(sourceHtml);
                    });

                    $template.remove();
                },
                /*
                 * We keep an array of all the checkboxes and their associated metadata
                 * This function scours the dom for these checkboxes and populates the
                 * array
                 */
                populateSourceArray: function() {
                    var me = this,
                        sourceHolders = $('.js-source');

                    // For each group of sources, create a collection of related elements
                    sourceHolders.each(function(index, source) {
                        var $source = $(source),
                            $sourceTotalCheck,
                            $sourceTotalCount,
                            $sourceChecks;

                        $sourceTotalCheck = $source.find('.js-sourceTotalCheck');
                        $sourceTotalCount = $source.find('.js-sourceTotalCount');
                        $sourceChecks = $source.find('.js-sourceCheck');

                        sources.push({
                            totalCheck: $sourceTotalCheck,
                            totalCount: $sourceTotalCount,
                            sourceChecks: $sourceChecks
                        });

                        me.updateTotalCheckCount(null, $sourceTotalCount, ['(All', $sourceChecks.length, 'selected)'].join(' '));


                    });
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

                    $(window).on('resize', _.debounce(this.sourceColumnSetup, 10));
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
                },
                /* This is a bit of a hack due to the class structure of the Pure grid explicityly determining
                  how many columns the grid has. We need to change this responsively. I'd like to do this with
                  CSS but we're still tied to the Pure grid. If I removed the Pure CSS then this wouldn't need
                  to be in JS. TODO, maybe. */
                sourceColumnSetup: function() {
                  if (window.innerWidth < 540) {
                    $('.pure-u-1-3').removeClass('pure-u-1-3').addClass('pure-u-1-2')
                  } else {
                    $('.pure-u-1-2').removeClass('pure-u-1-2').addClass('pure-u-1-3')
                  }
                }
            };

        sourceChecks.init();

        return sourceChecks;
    }

    new SourceChecks();

});
