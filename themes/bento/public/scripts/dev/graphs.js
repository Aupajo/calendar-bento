$(function() {
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
        return prev.concat(curr.events.map(extendEventData));
    }

    /* Creates a moment object for an objects `startTime` property (expected use in _.map) */
    function createStartDate(d) {
        d.startDate = new moment(d.startTime);

        return d;
    }

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
                .rangeRoundBands([0, monthData.width], 0.05),
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
      var sortedDates = _.chain(CAL.eventSources)
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
          displayMonth(month);
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
