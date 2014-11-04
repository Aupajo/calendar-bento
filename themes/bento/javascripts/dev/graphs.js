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
        }, {
        	"startTime": "2014-11-12 18:00",
        	"group": "CSS Meetup",
        	"title": "Drill #2: Packaging Design",
        	"location": "Empathy Office"
        }, {
        	"startTime": "2014-11-14 8:00",
        	"group": "Design & Thinking",
        	"title": "Let's meet up and chat about design",
        	"location": "Trade Kitchen"
        }, {
        	"startTime": "2014-11-14 18:30",
        	"group": "UX Wellington",
        	"title": "Service Design Special",
        	"location": "One Red Dog"
        }, {
        	"startTime": "2014-11-14 20:00",
        	"group": "Design Cinema",
        	"title": "Indie Game: The Movie",
        	"location": "Light House Cuba"
        }, {
        	"startTime": "2014-11-19 18:30",
        	"group": "Creative Tools Meetup",
        	"title": "InDesign 101 - 102",
        	"location": "Youbee School"
        }, {
        	"startTime": "2014-11-19 18:00",
        	"group": "UX Bookclub",
        	"title": "Don't Make Me Think: Steve Krug",
        	"location": "Southern Cross"
        }, {
        	"startTime": "2014-11-25 20:00",
        	"group": "Design Cinema",
        	"title": "PressPausePlay",
        	"location": "Light House Cuba"
        }, {
        	"startTime": "2014-11-12 18:00",
        	"group": "CSS Meetup",
        	"title": "Drill #2: Packaging Design",
        	"location": "Empathy Office"
        }, {
        	"startTime": "2014-11-14 8:00",
        	"group": "Design & Thinking",
        	"title": "Let's meet up and chat about design",
        	"location": "Trade Kitchen"
        }, {
        	"startTime": "2014-11-14 18:30",
        	"group": "UX Wellington",
        	"title": "Service Design Special",
        	"location": "One Red Dog"
        }, {
        	"startTime": "2014-11-12 20:00",
        	"group": "Design Cinema",
        	"title": "Indie Game: The Movie",
        	"location": "Light House Cuba"
        }, {
        	"startTime": "2014-11-09 18:30",
        	"group": "Creative Tools Meetup",
        	"title": "InDesign 101 - 102",
        	"location": "Youbee School"
        }, {
        	"startTime": "2014-11-09 18:00",
        	"group": "UX Bookclub",
        	"title": "Don't Make Me Think: Steve Krug",
        	"location": "Southern Cross"
        }, {
        	"startTime": "2014-12-05 20:00",
        	"group": "Design Cinema",
        	"title": "PressPausePlay",
        	"location": "Light House Cuba"
        }
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
            function daysInMonth() {
                //Currently assume that there is data here - TODO: change this
                return moment(month.data[0].date).daysInMonth();
            }

            function createBlockArray(blockNum, monthDigits, yearDigits, monthLenth) {
                var arr = [],
                    day;

                for (var i = 0; i < blockNum; i++) {
                    day = Math.floor(((i + 1) / blockNum) * monthLength);
                    arr.push({
                        count: 0,
                        date: new Date([yearDigits, '-', monthDigits, '-', day].join(''))
                    });
                }

                return arr;
            }

            var numberOfBlocks = 5,
                firstDate = moment(month.data[0].date),
                monthLength = daysInMonth(),
                monthDigits = firstDate.format('MM'),
                yearDigits = firstDate.format('YYYY'),
                dateArray = createBlockArray(numberOfBlocks, monthDigits, yearDigits, monthLength),
                currentDay,
                curentDayFormat,
                blockIndex;


            for (var i = 0, len = month.data.length; i < len; i++) {
                currentDay = month.data[i];
                currentDayFormat = parseInt(moment(currentDay.date).format('DD'));

                if (currentDayFormat === monthLength) {
                    blockIndex = numberOfBlocks - 1;
                } else {
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

    graphData.forEach(function(month, index, graphData) {
        month.index = index;
        month.totalMonths = graphData.length;
        displayMonth(month)
    });

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

});
