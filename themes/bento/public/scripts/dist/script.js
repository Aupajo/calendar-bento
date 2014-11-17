$(function() {
    // D3 - demo data
    var data = {
      "eventSources": [
        {
          "name": "Wellington APPS Photography Meetup Group",
          "url": "http://www.meetup.com/WellingtonPhotographyMeetupGroup",
          "events": []
        },
        {
          "name": "Wellington .NET User Group",
          "url": "http://www.meetup.com/WelliDotNet",
          "events": [
            {
              "title": "Wellington .NET User Group: Nuts and bolts of a real world application with John Rusk",
              "startTime": "2014-11-19T18:00:00+13:00",
              "endTime": "2014-11-19T21:00:00+13:00",
              "description": "<p>In November 2013, the OSPRI Disease Management System went live. It's essential to OSPRI New Zealand's world-leading success in eradicating Bovine Tuberculosis. The project won IT Project Excellence and Software Excellence categories at IITP's 2014 Excellence in IT Awards.</p> <p>John will talk about some of the key technical lessons learned during the project, such as:</p> <p><b>.NET Architecture</b></p> <p>Where does the business logic go?  The Domain Model , the Service Layer, a little of both, or somewhere else? Here’s what we did and how it worked out.</p> <p>The dark side of ASP.NET MVC.</p> <p><b>Handy SQL Server Techniques</b></p> <p>Using Row Versioning and the Resource Governor to safely support long-running queries, such as reports, on your production database.</p> <p>A quick overview of ubiquitous change auditing, and the \"magic\" compression of Clustered Columnstores.</p> <p><b>Testing and testability</b></p> <p>Allowing your system to travel through time. Realistically test long-running business processes in just a few minutes.</p> <p>Enforcing coding conventions with unit tests. These tests use reflection to look inside the implementation of methods, and assert that coding rules have been followed.</p>",
              "location": "Inov8 Ltd, Level 1, 44 Victoria Street, Wellington, nz",
              "url": "http://www.meetup.com/WelliDotNet/events/205897852/"
            },
            {
              "title": "Wellington .NET User Group: BizTalk 2013 R2 with RESTful service and JSON support with Sooraj Payyoormana",
              "startTime": "2014-11-26T18:00:00+13:00",
              "endTime": "2014-11-26T21:00:00+13:00",
              "description": "<p>The \"WCF-WebHttp\" adapter came with the BizTalk 2013 R2 will support both on-premises and cloud-based integration scenarios. The new JSON pipeline encoder and decoder enable BizTalk to send and receive JSON files. Join for this session to understand how these new additions will help us in integrating services with BizTalk .</p>",
              "location": "Inov8 Ltd, Level 1, 44 Victoria Street, Wellington, nz",
              "url": "http://www.meetup.com/WelliDotNet/events/207880362/"
            },
            {
              "title": "Wellington .NET User Group: The Actor Model with Project Orleans",
              "startTime": "2014-12-03T18:00:00+13:00",
              "endTime": "2014-12-03T21:00:00+13:00",
              "description": "<p>A quick introduction to developing scalable, distributed applications using the Actor Model with Microsoft's Project Orleans.</p>",
              "location": "Inov8 Ltd, Level 1, 44 Victoria Street, Wellington, nz",
              "url": "http://www.meetup.com/WelliDotNet/events/207544922/"
            },
            {
              "title": "Wellington .NET User Group: Well-Secured: The Wellington Security Defender Day",
              "startTime": "2014-12-10T10:00:00+13:00",
              "endTime": "2014-12-10T17:00:00+13:00",
              "description": "<p>The day before <a href=\"https://kiwicon.org/\">Kiwicon 8</a> in Wellington, we'll be having a meetup for those people involved in securing the applications developed by their company.</p> <p>Further details are available at <a href=\"http://www.well-secured.com\"><a href=\"http://www.well-secured.com\" class=\"linkified\">http://www.well-secured.com</a></a></p> <p>\n\n\nThe location will be confirmed closer to the time, depending upon attendee numbers.</p>",
              "location": null,
              "url": "http://www.meetup.com/WelliDotNet/events/205346102/"
            },
            {
              "title": "Wellington .NET User Group: UX/Usability for Developers with Gareth Bradley",
              "startTime": "2014-12-17T18:00:00+13:00",
              "endTime": "2014-12-17T21:00:00+13:00",
              "description": null,
              "location": "Inov8 Ltd, Level 1, 44 Victoria Street, Wellington, nz",
              "url": "http://www.meetup.com/WelliDotNet/events/207765282/"
            },
            {
              "title": "Wellington .NET User Group: Christmas Function",
              "startTime": "2014-12-24T18:00:00+13:00",
              "endTime": "2014-12-24T21:00:00+13:00",
              "description": "<p>Let's meet up for a few drinks to celebrate the year.</p>",
              "location": null,
              "url": "http://www.meetup.com/WelliDotNet/events/207545432/"
            },
            {
              "title": "Wellington .NET User Group: Cassandra with Aaron Morton",
              "startTime": "2015-02-18T18:00:00+13:00",
              "endTime": "2015-02-18T21:00:00+13:00",
              "description": "<p>Come and listen to Aaron talk about the Cassandra database platform and how it can be used by .NET clients.</p>",
              "location": "Inov8 Ltd, Level 1, 44 Victoria Street, Wellington, nz",
              "url": "http://www.meetup.com/WelliDotNet/events/207665902/"
            }
          ]
        }
      ]
    };

    // Graph container and dimensions
    var $containerEl = $('.js-graph'),
        containerElWidth = $containerEl.width(),
        containerElHeight = $containerEl.height(),
        lazyGraphRemoval = _.debounce(destroyGraphs, 10),
        lazyGraphRecalculation = _.debounce(showResizedGraphs, 150);

    // Bind window resize event to destroy andrecalculate graphs on browser window size change
    $(window).on('resize', lazyGraphRemoval);
    $(window).on('resize', lazyGraphRecalculation);

    // Right. Let's do this.
    showGraphs();

    /* Returns an array containing just event details from the original eventSources object */
    function getSourcesEventData(prev, curr) {
        function extendEventData(event) {
          return _.assign(event, {
            group: curr.name,
            groupURL: curr.url
          });
        }
        if (!prev) {
          return curr.events.map(extendEventData);
        }
        return prev.concat(curr.events.map(extendEventData))
    }

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

    /* Group by blocks -> 5 blocks per month (expected use in _.groupBy) */
    function groupByBlock(d) {
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
    function buildMonthData(m, i) {
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

        /* Returns days of events grouped into 5 blocks  */
        function buildOutBlocks(month) {
            /* Returns how many days are in a given month via a date object */
            function daysInMonth(date) {
              if (!date) {
                return 0;
              }

              return moment(date).daysInMonth();
            }

            /* Creates an array of objects that are used to contain all the events grouped
               into subsets of a month. This function requires which month the dates are for
               as well as which year it is to generate the correct subset of dates in the
               return array. */
            function createBlockArray(blockNum, monthDigits, yearDigits, monthLenth) {
                var arr = [],
                    day;

                for (var i = 0; i < blockNum; i++) {
                    day = Math.floor(((i + 1) / blockNum) * monthLength);

                    // Default count to 0 for if we never add any more events to the returned array
                    arr.push({
                        count: 0,
                        date: new Date([yearDigits, '-', monthDigits, '-', day].join(''))
                    });
                }

                return arr;
            }

            var numberOfBlocks = 5, // How many groups of events the month has
                firstDate = moment(month.data[0].date),
                monthLength = daysInMonth(firstDate),
                monthDigits = firstDate.format('MM'),
                yearDigits = firstDate.format('YYYY'),
                dateArray = createBlockArray(numberOfBlocks, monthDigits, yearDigits, monthLength),
                currentDay,
                curentDayFormat,
                blockIndex;

            // Sort out all the given month event data into their correct block. The only edge case
            // here is the last day of the month which we always want at length - 1 (because of the 0
            // base index of the array).
            for (var i = 0, len = month.data.length; i < len; i++) {
                currentDay = month.data[i];
                currentDayFormat = parseInt(moment(currentDay.date).format('DD'));

                if (currentDayFormat === monthLength) {
                    blockIndex = numberOfBlocks - 1;
                } else {
                    // Get percentage where the day is. Reduce it down to a usable number.
                    blockIndex = Math.floor((moment(currentDay.date).format('DD') / monthLength) * numberOfBlocks);
                }

                if (dateArray[blockIndex].data === undefined) {
                    dateArray[blockIndex].data = currentDay.data;
                    dateArray[blockIndex].count = currentDay.count;
                } else {
                    dateArray[blockIndex].data = dateArray[blockIndex].data.concat(currentDay.data);
                    dateArray[blockIndex].count += currentDay.data.length;
                }
            }
            return dateArray;
        }

        // Still need to deal with data that is > a few months
        var numberOfMonths = monthData.length <= 1 ? 2 : monthData.length, //We always want to show at least 2 months
            displayLength = numberOfMonths < 6 ? numberOfMonths : 6, //Show max of 6 graphs
            numberOfSmallGraphs = displayLength - 2,
            smallGraphWidth = 60,
            largeGraphWidth = (containerElWidth - (numberOfSmallGraphs * smallGraphWidth)) / 2;

        // Map our data over the correct function. Either block or month (TODO - add in 'More' block
        // here too. Needed for data with > 6 months worth of info)
        return monthData.map(function(month, index) {
            var completeMonth = index < 2 ? buildOutMonth(month) : buildOutBlocks(month),
                width = index < 2 ? largeGraphWidth : smallGraphWidth,
                showAxisLines = index < 2 ? true : false,
                offset = index <= 2 ?
                    largeGraphWidth * index :
                    (largeGraphWidth * 2) + (smallGraphWidth * (index - 2));

            return {
                count: completeMonth.length,
                width: width,
                showAxisLines: showAxisLines,
                offset: offset,
                label: month.dateLabel,
                data: completeMonth
            };
        });

    }

    /*
     * Renders a single graph to the graph container. The `monthData` is expected to have the following
     * format:
     * monthData = {
     *  count	-> how many days we are creating the graph for
     *  width	-> the total width of the graphs
     *  showAxisLines -> Do we want to show the x-axis ticks?
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
            maxY = 9,
            x = d3.scale.ordinal()
                .domain(monthData.data.map(returnDate))
                .rangeRoundBands([0, monthData.width], .05),
            y = d3.scale.linear()
                .domain([0, maxY])
                .range([0, containerElHeight - margin - 15]),
            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom"),
            yAxis = d3.svg.axis()
                .orient('left'),
            xAxisTickClass = monthData.showAxisLines ? 'axis' : 'axis axis-hideTicks',
            barOffset = monthData.showAxisLines ? (monthData.width / monthData.count / 2) * -1 : 0;

        var svg = d3.select($containerEl[0]).append('svg');

        // Set our dimensions up for this month
        svg.attr('width', monthData.width)
            .attr('style', 'left: ' + monthData.offset + 'px')
            .attr('height', containerElHeight)
            .attr('class', 'eventGraph')
            .append('g');

        // Create the individual bars for the graph
        svg.selectAll("rect")
            .data(monthData.data)
            .enter().append("rect")
            .style("fill", "white")
            .attr("x", function(d) { return x(returnDate(d)); })
            .attr("width", x.rangeBand())
            // Note: below the -1 creates a 1px gap between the axis the bar
            .attr("y", function(d) {
                var count = d.count > maxY ? maxY : d.count;
                return containerElHeight - lineHeight - 1 - y(count);
            })
            .attr("height", function(d) { return y(d.count) || 0; })
            // monthData.width / monthData.count / 2 => offset the axis by half a bar to get the axis dashes in the right place
            .attr("transform", "translate(" + barOffset + ", 0)")
            .attr('class', 'graphBar');

        // Create the x axis
        // containerElHeight - lineHeight => makes room for the label the label sits
        svg.append("g")
            .attr("class", xAxisTickClass)
            .attr("transform", "translate(0," + (containerElHeight - lineHeight) + ")")
            .call(xAxis);

        // Start axis line divider
        svg.append("rect")
            .attr("class", 'graphDivider')
            .attr("height", 20)
            .attr("width", 1)
            .attr("transform", "translate(0," + (containerElHeight - lineHeight) + ")");

        if (monthData.index + 1 === monthData.totalMonths) {
            // End axis line divider
            svg.append("rect")
                .attr("class", 'graphDivider')
                .attr("height", 20)
                .attr("width", 1)
                .attr("transform", "translate(" + (monthData.width - 1) + "," + (containerElHeight - lineHeight) + ")");
        }

        // Append the text to the axis
        svg.append("text")
            .attr("class", "axisLabel")
            .attr("transform", "translate(" + (monthData.width / 2) + " ," + containerElHeight +")")
            .style("text-anchor", "middle")
            .text(monthData.label);

    }

    /* Actually utlise all the functions above and create the graphs */
    function showGraphs() {
      // Sort and group all our data into to the correct format
      var sortedDates = _.chain(data.eventSources)
          .reduce(getSourcesEventData, [])
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

      // Create each graph
      graphData.forEach(function(month, index, graphData) {
          month.index = index;
          month.totalMonths = graphData.length;
          displayMonth(month)
      });
    }

    /* Destroy the current graphs */
    function destroyGraphs() {
      $containerEl.html('');
    }

    /* Rebuilds graphs and recalculate the appropriate graph dimensions */
    function showResizedGraphs() {
      // Recaulate the closure variables for the new element sizes
      containerElWidth = $containerEl.width(),
      containerElHeight = $containerEl.height();

      showGraphs();
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

                    $(window).on('resize', _.debounce(this.resetOverlayDimensions, 10));
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
