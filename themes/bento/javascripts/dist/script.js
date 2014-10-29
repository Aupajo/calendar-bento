$(function() {
    // D3 - demo data
    var data = [
        {
            "startTime": "2014-09-01 18:00",
            "group": "CSS Meetup",
            "title": "Drill #2: Packaging Design",
            "location": "Empathy Office"
        }, {
            "startTime": "2014-09-12 18:00",
            "group": "CSS Meetup",
            "title": "Drill #2: Packaging Design",
            "location": "Empathy Office"
        }, {
            "startTime": "2014-09-14 8:00",
            "group": "Design & Thinking",
            "title": "Let's meet up and chat about design",
            "location": "Trade Kitchen"
        }, {
            "startTime": "2014-09-14 18:30",
            "group": "UX Wellington",
            "title": "Service Design Special",
            "location": "One Red Dog"
        }, {
            "startTime": "2014-09-14 20:00",
            "group": "Design Cinema",
            "title": "Indie Game: The Movie",
            "location": "Light House Cuba"
        }, {
            "startTime": "2014-09-19 18:30",
            "group": "Creative Tools Meetup",
            "title": "InDesign 101 - 102",
            "location": "Youbee School"
        }, {
            "startTime": "2014-09-19 18:00",
            "group": "UX Bookclub",
            "title": "Don't Make Me Think: Steve Krug",
            "location": "Southern Cross"
        }, {
            "startTime": "2014-09-25 20:00",
            "group": "Design Cinema",
            "title": "PressPausePlay",
            "location": "Light House Cuba"
        }, {
            "startTime": "2014-10-12 18:00",
            "group": "CSS Meetup",
            "title": "Drill #2: Packaging Design",
            "location": "Empathy Office"
        }, {
            "startTime": "2014-10-14 8:00",
            "group": "Design & Thinking",
            "title": "Let's meet up and chat about design",
            "location": "Trade Kitchen"
        }, {
            "startTime": "2014-10-14 18:30",
            "group": "UX Wellington",
            "title": "Service Design Special",
            "location": "One Red Dog"
        }, {
            "startTime": "2014-10-14 20:00",
            "group": "Design Cinema",
            "title": "Indie Game: The Movie",
            "location": "Light House Cuba"
        }, {
            "startTime": "2014-10-19 18:30",
            "group": "Creative Tools Meetup",
            "title": "InDesign 101 - 102",
            "location": "Youbee School"
        }, {
            "startTime": "2014-10-19 18:00",
            "group": "UX Bookclub",
            "title": "Don't Make Me Think: Steve Krug",
            "location": "Southern Cross"
        }, {
            "startTime": "2014-10-25 20:00",
            "group": "Design Cinema",
            "title": "PressPausePlay",
            "location": "Light House Cuba"
        }//, {
        // 	"startTime": "2014-11-12 18:00",
        // 	"group": "CSS Meetup",
        // 	"title": "Drill #2: Packaging Design",
        // 	"location": "Empathy Office"
        // }, {
        // 	"startTime": "2014-11-14 8:00",
        // 	"group": "Design & Thinking",
        // 	"title": "Let's meet up and chat about design",
        // 	"location": "Trade Kitchen"
        // }, {
        // 	"startTime": "2014-11-14 18:30",
        // 	"group": "UX Wellington",
        // 	"title": "Service Design Special",
        // 	"location": "One Red Dog"
        // }, {
        // 	"startTime": "2014-11-14 20:00",
        // 	"group": "Design Cinema",
        // 	"title": "Indie Game: The Movie",
        // 	"location": "Light House Cuba"
        // }, {
        // 	"startTime": "2014-11-19 18:30",
        // 	"group": "Creative Tools Meetup",
        // 	"title": "InDesign 101 - 102",
        // 	"location": "Youbee School"
        // }, {
        // 	"startTime": "2014-11-19 18:00",
        // 	"group": "UX Bookclub",
        // 	"title": "Don't Make Me Think: Steve Krug",
        // 	"location": "Southern Cross"
        // }, {
        // 	"startTime": "2014-11-25 20:00",
        // 	"group": "Design Cinema",
        // 	"title": "PressPausePlay",
        // 	"location": "Light House Cuba"
        // }, {
        // 	"startTime": "2014-11-12 18:00",
        // 	"group": "CSS Meetup",
        // 	"title": "Drill #2: Packaging Design",
        // 	"location": "Empathy Office"
        // }, {
        // 	"startTime": "2014-11-14 8:00",
        // 	"group": "Design & Thinking",
        // 	"title": "Let's meet up and chat about design",
        // 	"location": "Trade Kitchen"
        // }, {
        // 	"startTime": "2014-11-14 18:30",
        // 	"group": "UX Wellington",
        // 	"title": "Service Design Special",
        // 	"location": "One Red Dog"
        // }, {
        // 	"startTime": "2014-11-12 20:00",
        // 	"group": "Design Cinema",
        // 	"title": "Indie Game: The Movie",
        // 	"location": "Light House Cuba"
        // }, {
        // 	"startTime": "2014-11-09 18:30",
        // 	"group": "Creative Tools Meetup",
        // 	"title": "InDesign 101 - 102",
        // 	"location": "Youbee School"
        // }, {
        // 	"startTime": "2014-11-09 18:00",
        // 	"group": "UX Bookclub",
        // 	"title": "Don't Make Me Think: Steve Krug",
        // 	"location": "Southern Cross"
        // }, {
        // 	"startTime": "2014-12-05 20:00",
        // 	"group": "Design Cinema",
        // 	"title": "PressPausePlay",
        // 	"location": "Light House Cuba"
        // }
    ];

    // Graph container and dimensions
    var $containerEl = $('.js-graph'),
        containerElWidth = $containerEl.width(),
        containerElHeight = $containerEl.height();

    /* Creates a moment object for an objects `startTime` property (expected use in _.map) */
    function createStartDate(d) {
        d.startDate = new moment(d.startTime);

        return d;
    };

    /* Group by month of the year (expected use in _.groupBy)*/
    function groupByMonth(d) {
        try {
            return d.startDate.format('YYMM');
        } catch(e) {
            // Just in case. Won't result in the prettiest graph, but at least we can see it's broken withou
            // stopping the script execution
            return '0000';
        }
    }

    /* Group by day of the month (expected use in _.groupBy)*/
    function groupByDay(d) {
        try {
            return d.startDate.format('MMDD');
        } catch(e) {
            // Just in case. Won't result in the prettiest graph, but at least we can see it's broken withou
            // stopping the script execution
            return '0000';
        }
    }

    /* Build the expeced data structure for a month of events (expected use in _.map) */
    function buildMonthData(m) {
        // Assume it's not an empty array
        var firstItem = m[0];

        return {
            data: _(m)
                .groupBy(groupByDay)
                .map(buildDayData).value(),
            count: m.length,
            dateKey: firstItem.startDate.format('YYMM'),
            dateLabel: firstItem.startDate.format('MMM'),
            month: firstItem.startDate.format('MM'),
            year: firstItem.startDate.format('YYYY')
        }
    }

    /* Build the expeced data structure for a day of events (expected use in _.map) */
    function buildDayData(d) {
        return {
            data: d,
            count: d.length,
            date: d[0].startDate.toDate(),
            dateKey: d[0].startDate.format('MMDD'),
        };
    }

    /* Build a complete graph-ready representation of the monthly data */
    function buildMultigraphData(monthData) {
        /* Pass through the 'key' of the date (assumes that exists) and finds all events for
        that day */
        function findDay(dateKey, lookupData) {
            var currentDay;
            for (var i = 0, len = lookupData.count; i < len; i++) {
                currentDay = lookupData.data[i];
                if (!currentDay) {
                    continue;
                }
                if (currentDay.dateKey == dateKey) {
                    return currentDay;
                }
            }
        }

        /* Returns an entire month of data, including 'empty' states for days that don't have any
            events */
        function buildOutMonth(month) {
            function daysInMonth() {
                //Currently assume that there is data here - TODO: change this
                return moment(month.data[0].date).daysInMonth();
            }

            var dateArray = [];

            for (var i = 1, len = daysInMonth(); i <= len; i++) {
                currentDate = new moment([month.year, '-', month.month, '-', i].join(''));
                currentData = findDay(currentDate.format('MMDD'), month);
                if (currentData) {
                    dateArray.push({
                        date: currentDate.toDate(),
                        count: currentData.count,
                        data: currentData.data
                    });
                } else {
                    dateArray.push({
                        date: currentDate.toDate(),
                        count: 0
                    });
                }
            }

            return dateArray;
        }

        // Still need to deal with data that is > a few months
        var numberOfMonths = monthData.length <= 1 ? monthData.length :	 2, //We always want to show at least 2 months
            displayLength = numberOfMonths < 6 ? numberOfMonths : 6, //Show max of 6 graphs
            numberOfSmallGraphs = displayLength - 2,
            largeGraphWidth = displayLength === 2 ? (containerElWidth / 2) : (containerElWidth / 3),
            smallGraphWidth = ((containerElWidth / 3) / 5);

        return monthData.map(function(month, index) {
            var completeMonth = buildOutMonth(month),
                width = index < 2 ? largeGraphWidth : smallGraphWidth,
                offset = index < 2 ?
                    largeGraphWidth * index :
                    0; // TODO - Needed for more than two months

            return {
                count: completeMonth.length,
                width: width,
                offset: offset,
                label: month.dateLabel,
                data: completeMonth
            };
        });

    }

    var sortedDates = _.chain(data)
        .map(createStartDate)
        .sortBy(function(d) {
            // Sort via the date only, set time to 0
            return d.startDate
                .hours(0)
                .minutes(0)
                .seconds(0)
                .milliseconds(0)
                .toDate()
            })
        .groupBy(groupByMonth)
        .map(buildMonthData).value(),

        numberOfMonths = sortedDates.length;

    var graphData = buildMultigraphData(sortedDates);

    graphData.forEach(function(month) {
        displayMonth(month)
    });

    /*
     * Renders a single graph to the graph container. The `monthData` is expected to have the following
     * format:
     * monthData = {
     *  count	-> how many days we are creating the graph for
     *  width	-> the total width of the graphs
     *  offset	-> how far from the left the graph should be
     *  label	-> what we put underneath the graph itself (i.e. the month name shorthand)
     *  data	-> an array of days and that days associated events
     * }
     */
    function displayMonth(monthData) {
        /* Short function to return the date of an object (helpful for d3 methods)*/
        function returnDate(d) {
            return d.date;
        }

        var margin = 6,			// Top margin for the bars
            lineHeight = 20,	// The space we want for the label
            maxY = d3.max(monthData.data, function(d) {
                return d.count;
            }),
            x = d3.scale.ordinal()
                .domain(monthData.data.map(returnDate))
                .rangeRoundBands([0, monthData.width], .05),
            y = d3.scale.linear()
                .domain([0, maxY])
                .range([0, containerElHeight - margin - 15]),
            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .tickFormat(d3.time.format("%d")),
            yAxis = d3.svg.axis()
                .orient('left');

        var svg = d3.select($containerEl[0]).append('svg');

        // Set our dimensions up for this month
        svg.attr('width', monthData.width)
            .attr('height', containerElHeight)
            .attr('class', 'eventGraph')
            .append('g');

        // Create the individual bars for the graph
        svg.selectAll("bar")
            .data(monthData.data)
            .enter().append("rect")
            .style("fill", "white")
            .attr("x", function(d) { return x(returnDate(d)); })
            .attr("width", x.rangeBand())
            // Note: below the -1 creates a 1px gap between the axis the bar
            .attr("y", function(d) { return containerElHeight - lineHeight - 1 - y(d.count); })
            .attr("height", function(d) { return y(d.count) || 0; })
            .attr('class', 'graphBar');

        // Create the x axis
        // monthData.width / monthData.count / 2 => offset the axis by half a bar to get the axis dashes in the right place
        // containerElHeight - lineHeight => makes room for the label the label sits
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(-" + (monthData.width / monthData.count / 2) + "," + (containerElHeight - lineHeight) + ")")
            .call(xAxis);

        // Append the text to the axis
        svg.append("text")
            .attr("class", "axisLabel")
            .attr("transform", "translate(" + (monthData.width / 2) + " ," + containerElHeight +")")
            .style("text-anchor", "middle")
            .text(monthData.label);

    }

});
;$(function() {
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
;$(function() {
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
