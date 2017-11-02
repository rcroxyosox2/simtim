import moment from 'moment';
import ArrayHelp from './ArrayHelp.jsx';

export class GroupDataCreator {
    constructor(userOptions) {
        let options = Object.assign({
            dataType: "", // the data name to use for sorting out the data sets (GROUP_DATA_TYPES)
            data: null, // the firebase.val() data
            keyString: null, // the key to use as the source of data taken from options.data
            normalizer: null, // optionally normalize the data manually instead of using the average
            duration: null // the span of time to use (TODO: Do this)
        }, userOptions);

        Object.assign (this, options);
    }
}


 // Takes incoming data from the firebase response and makes arrays of these "groupedItems": 
 //  {date: 1478851200000, dataType: GROUP_DATA_TYPES.SYMPTOM, data: 2, dateFormatted: "Nov 16", normalizedData: 1.0769230769230769}

export class HomeGraphDataHelp {

    static get DURATIONS() {
        return {
            YEARS_5: "YEARS_5",
            YEARS_2: "YEARS_2",
            YEAR: "YEAR",
            MONTH : "MONTH",
            WEEK : "WEEK",
            DAY : "DAY",
            MAX : "MAX"
        }
    }

    // posible logic needed later to determine if this is a user prop
    static get DEFAULT_DURATION() {
        return HomeGraphDataHelp.DURATIONS.MAX;
    }

    // used for display purposes in the UI
    static get USER_DURATIONS() {
        return {
            "last week" : HomeGraphDataHelp.DURATIONS.WEEK,
            "last month" : HomeGraphDataHelp.DURATIONS.MONTH,
            "max" : HomeGraphDataHelp.DURATIONS.MAX
        }
    }

    static get DATE_GRANULARITY() {
        return {
            YEAR: "YEAR",
            MONTH: "MONTH",
            DAY: "DAY",
            HOUR: "HOUR"
        };
    }

    static get DATE_FORMATTERS() {
        return {
            YEAR: "YYYY",
            MONTH: "MMM YY",
            DAY: "MM-DD-YYYY",
            HOUR: "ddd h:mm"
        };
    }

    constructor(passedOptions) {
        var options = Object.assign({
            groupDataCreators: null, //  Should be an array of groupItemCreators's
            duration: HomeGraphDataHelp.DURATIONS.MAX // duration set by the user
        }, passedOptions);

        Object.assign(this, options);

        for (let i in this.groupDataCreators) {
            if(!(this.groupDataCreators[i] instanceof GroupDataCreator)) {
                throw new Error('this.groupDataCreators should be an instance of GroupDataCreator');
            }
        }

        // private props
        this._availableDurations = this._getAvailableDurations();
        this._calculatedDuration = this._getCalculatedDuration();
        this.granularity = this._getGranularityFromDuration();
        this._durationFilter = this._getDurationFilter();
        this._groupItemData = this._convertDataToGroupItems(); // The prepped data for the graph
    }

    _getGranularityFromDuration() {
        let calculatedDuration = this._calculatedDuration;
        let durationToGranulariyMap = {};
        let d = HomeGraphDataHelp.DURATIONS;
        let g = HomeGraphDataHelp.DATE_GRANULARITY;

        durationToGranulariyMap[d.YEARS_5] = g.YEAR;
        durationToGranulariyMap[d.YEARS_2] = g.YEAR;
        durationToGranulariyMap[d.YEAR] = g.MONTH;
        durationToGranulariyMap[d.MONTH] = g.DAY;
        durationToGranulariyMap[d.WEEK] = g.DAY;
        durationToGranulariyMap[d.DAY] = g.HOUR;

        return durationToGranulariyMap[calculatedDuration];
    }

    _dateWithin(dateStamp, timeAmount, timeName, endTime = moment()) {
        return moment(parseInt(dateStamp)).isBetween(moment().startOf('day').subtract(timeAmount, timeName), endTime)
    }

    _getAvailableDurations() { // Only use on firebase data

        let availableDurations = {}; for (let k in HomeGraphDataHelp.DURATIONS) { availableDurations[k] = 0;}

        this.groupDataCreators.forEach((groupItemArrCreator) => {
            let data = groupItemArrCreator.data;
            for (let k in data) {
                let item = data[k];

                if (this._dateWithin(item.date, 1, "day", moment())) {
                    availableDurations[HomeGraphDataHelp.DURATIONS.DAY] += 1;
                }

                if (this._dateWithin(item.date, 1, "week", moment().subtract(1, "day"))) {
                    availableDurations[HomeGraphDataHelp.DURATIONS.WEEK] += 1;
                }

                if (this._dateWithin(item.date, 1, "month", moment().subtract(1, "week"))) {
                    availableDurations[HomeGraphDataHelp.DURATIONS.MONTH] += 1;
                }

                if (this._dateWithin(item.date, 1, "year", moment().subtract(1, "month"))) {
                    availableDurations[HomeGraphDataHelp.DURATIONS.YEAR] += 1 ;
                }

                if (this._dateWithin(item.date, 2, "year", moment().subtract(1, "year"))) {
                    availableDurations[HomeGraphDataHelp.DURATIONS.YEARS_2] += 1 ;
                }

                if (this._dateWithin(item.date, 5, "year", moment().subtract(2, "years"))) {
                    availableDurations[HomeGraphDataHelp.DURATIONS.YEARS_5] += 1 ;
                }

            }
        });

        return availableDurations;
    }

    _getCalculatedDuration() {

        if(!this._availableDurations) {
            console.warn(`No _availableDurations set (${this._availableDurations})`);
            return;
        }

        let userSetUseration = this.duration;
        let availableDurations = this._availableDurations;

        let durationOrder = [
            HomeGraphDataHelp.DURATIONS.YEARS_5,
            HomeGraphDataHelp.DURATIONS.YEARS_2,
            HomeGraphDataHelp.DURATIONS.YEAR,
            HomeGraphDataHelp.DURATIONS.WEEK,
            HomeGraphDataHelp.DURATIONS.MONTH,
            HomeGraphDataHelp.DURATIONS.DAY
        ];

        const getOldestDuration = (startingIndex = 0) => {
            let oldestDuration;
            for (let i = startingIndex; i < durationOrder.length; i++) {
                if(availableDurations[durationOrder[i]] > 0) {
                    oldestDuration = durationOrder[i];
                    break;
                }
            }
            return oldestDuration;
        }

        if(userSetUseration == HomeGraphDataHelp.DURATIONS.MAX) {
            return getOldestDuration();
        }
        else {

            let startingIndex = durationOrder.indexOf(userSetUseration);
            return getOldestDuration(startingIndex);
        }

        return;
    }

    // should be used on a array.filer call
    _getDurationFilter() {

        let duration = this._calculatedDuration;

        if(!duration){
            return (item) => { return item; }
        }

        let [str, amount] = duration.split("_");
        amount = (!amount) ? 1 : amount;
        str = str.toLowerCase();

        return (item) => { // Expects a groupItem
            return this._dateWithin(item.date, amount, str, moment());
        }
    }

    _convertDataToGroupItems() {
        let ret = [];
        this.groupDataCreators.forEach((groupItemArrCreator) => {
            let itemGroup = this._convertDataToGroupItem(groupItemArrCreator);
            if(itemGroup 
                && Object.keys(itemGroup)[0] 
                && itemGroup[Object.keys(itemGroup)[0]].length > 0) {
                ret.push(itemGroup)
            }
        });

        return ret;
    }


    // Converts this.groupDataCreators items into groupedItems
    _convertDataToGroupItem(groupDataCreator) {

        let groupedData = {};
        let check = {};
        let data = groupDataCreator.data;


        if(Object.keys(data).length === 0){
            return [];
        }

        // Put all the data in an json blob organized by date as key and the data for that date as value (array)
        for (let k in data) {
            let item = data[k];
            let dateFormatted = moment(parseInt(item.date)).format(HomeGraphDataHelp.DATE_FORMATTERS[this.granularity]);
            let dataItem = parseInt(item[groupDataCreator.keyString]) || 0;

            if (!groupedData[dateFormatted]) {
                groupedData[dateFormatted] = {
                    date: item.date,
                    dataType: groupDataCreator.dataType
                };
            }

            if (!groupedData[dateFormatted].data) {
                groupedData[dateFormatted].data = [dataItem];
            } else {
                groupedData[dateFormatted].data.push(dataItem);
            }
        };

        // get the average within a group  
        let dataToNormalize = [];
        for (let dateFormatted in groupedData) {
            let avg = ArrayHelp.arrayAvg(groupedData[dateFormatted].data);
            dataToNormalize.push(avg);
            groupedData[dateFormatted].data = avg;
        }

        // Normalize the data
        dataToNormalize = ArrayHelp.arrayNormalize(dataToNormalize, groupDataCreator.normalizer);

        // Add all the computed values
        let i = 0;
        let groupedDataArr = Object.keys(groupedData).map((k, v, o) => {
            let item = groupedData[k];
            item.dateFormatted = k;
            item.normalizedData = dataToNormalize[i];
            i++;
            return item;
        });

        // Sort the data by date
        groupedDataArr = groupedDataArr.sort(ArrayHelp.sortByDate);
        groupedDataArr = groupedDataArr.filter(this._durationFilter.bind(this));

        let ret = {};
        ret[groupDataCreator.dataType] = groupedDataArr;
        // console.log("on:::", ret);
        return ret;
    }

    _convertToListData() {
        let arr = [];
        for(let i = 0; i < this.groupDataCreators.length; i++) {
            let group = this.groupDataCreators[i];
            for(let k in group.data) {
                let rawDate = parseInt(group.data[k].date);
                arr.push(Object.assign({key: k, dataType: group.dataType, dateFormatted: moment(rawDate).format("MM/DD/YYYY")}, group.data[k]));
            }
        }
        return arr;
    }

    getRawDataByDate(filter) {
        let data = this._convertToListData();
        if(filter){
            return data.filter(filter).sort(ArrayHelp.sortByDate);
        }
        return data.sort(ArrayHelp.sortByDate);
    }

    getGroupedDataByDate() {
        // console.log("after:::", this._groupItemData);

        // Merge all the data together
        let merged = [].concat.apply([], this._groupItemData.map(group => {
            return Object.values(group)[0];
        })).sort(ArrayHelp.sortByDate);
        
        return merged;
    }

    getChartReadyData() {

        // Merge all the data together
        let merged = this.getGroupedDataByDate();
        
        // TODO: Get rid of all the expensive "ArrayHelp.pluck(y, "x")" calls and put into one loop
        let dupIndexes = ArrayHelp.arrayDups(ArrayHelp.pluck(merged, "dateFormatted"));
        let keys = ArrayHelp.mergeDedupe(ArrayHelp.pluck(merged, "dataType"));

        let mergedFormatted = [];
        let data = [];
        let dedupedByDateFormatted = ArrayHelp.dedupOnKey(merged, "dateFormatted");
        let labels = ArrayHelp.pluck(dedupedByDateFormatted, "dateFormatted");
        let labelDateStamps = ArrayHelp.pluck(dedupedByDateFormatted, "date");

        // const getFillValue = function(prev, next, current) {
        //     if(!prev || !next) return current.normalizedData;
        //     return (prev.normalizedData + prev.normalizedData) / 2;
        // }

        // get the labels

        // Loop through each item, creating a new set that includes every item and get them into a data object for the graph
        for (var i = 0; i < keys.length; i++) {
            let key = keys[i];
            let seriesObject = {className: key, name: key, data:[]}

            merged.forEach((item, j) => {
                var newItem = Object.assign({}, item);
                
                // console.log(newItem);
                if (item.dataType !== key) {
                    // var fillValue = getFillValue(merged[j-1], merged[j+1], item);
                    newItem.data = newItem.normalizedData = null; // change this to null to see data with holes
                    if(dupIndexes.indexOf(item.dateFormatted) > -1){
                        return;
                    }
                }

                seriesObject.data.push(newItem.normalizedData);

            });
            
            mergedFormatted.push(seriesObject);

            // Set the data and the labels
            data.push(ArrayHelp.pluck(mergedFormatted[i], "normalizedData"));
        }

        return {labels: labels, series: mergedFormatted, labelDateStamps};

    }

}



