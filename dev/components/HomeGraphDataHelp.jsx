import moment from 'moment';


export class ArrayHelp {

    /* a: expects and array */
    static arrayAvg(a, iterator){
        let s = 0;
        const l = a.length;
        for (let i = 0; i < l; i++) {
            let n = a[i];
            s += parseInt(n); iterator && iterator(n);
        }
        return s / a.length;
    }

    /* a: expects and array */
    static arrayNormalize(a, normalizer){
        let avg = (normalizer) ? normalizer : ArrayHelp.arrayAvg(a);
        return a.map(v =>{
            return (v / avg);
        });
    }

    static pluck(obj, key, where){
        return Object.keys(obj).map((f) => {
            var item = obj[f][key];
            if(where && item == where) {
                return item;
            }
            return item
        })
    }

    static mergeDedupe(arrOfArrs){
      return [ ...new Set( [].concat( ...arrOfArrs ) ) ];
    }

    static arrayDups(a) {
        var len = a.length,
          out = [],
          counts = {};

        for (var i=0;i<len;i++) {
            var item = a[i];
            counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
            if (counts[item] === 2) {
              out.push(item);
            }
        }

        return out;
    }

    static sortByDate(a,b) {

        let date1 = a
        let date2 = b;

        if(a.date){
            date1 = a.date;
            date2 = b.date;
        }

        return new Date(date1) - new Date(date2);
    }

}



export class GroupDataCreator {
    constructor(userOptions) {
        let options = Object.assign({
            dataName: "", // the data name to use for sorting out the data sets
            data: null, // the firebase.val() data
            keyString: null, // the key to use as the source of data taken from options.data
            normalizer: null, // optionally normalize the data manually instead of using the average
            granularity: HomeGraphDataHelp.DEFAULT_GRANULARITY, // the granularity to show data (ie. month, day, year, etc TODO: make this smart)
            duration: null // the span of time to use (TODO: Do this)
        }, userOptions);

        Object.assign (this, options);
    }
}


 // Takes incoming data from the firebase response and makes arrays of these "groupedItems": 
 //  {date: 1478851200000, dataName: "symptom", data: 2, dateFormatted: "Nov 16", normalizedData: 1.0769230769230769}

export class HomeGraphDataHelp {

    static get DATE_FORMATTERS() {
        return {
            YEAR: "YYYY",
            MONTH: "MMM YY",
            DAY: "ddd MMM DD YY"
        };
    }

    static get DEFAULT_GRANULARITY() {
        return HomeGraphDataHelp.DATE_FORMATTERS.MONTH;
    }

    constructor(passedOptions) {
        var options = Object.assign({
            data: null, //  Should be an array of GroupItem's
            granularity: HomeGraphDataHelp.DEFAULT_GRANULARITY,
            duration: null
        }, passedOptions);


        Object.assign(this, options);
        for (let i in this.data) {
            if(!(this.data[i] instanceof GroupDataCreator)) {
                throw new Error('this.data should be an instance of GroupItem');
            }
        }

    }

    getConvertedGroupItems() {
        let ret = [];
        this.data.forEach((groupItem) => {
            ret.push(this.getConvertedGroupItem(groupItem))
        })
        return ret;
    }


    // Converts this.data items into groupedItems
    getConvertedGroupItem(groupItem) {

        let options = groupItem;
        let groupedData = {};
        let check = {};
        let data = options.data;

        // Put all the data in an json blob organized by date as key and the data for that date as value (array)
        for (let k in data) {
            let item = data[k];
            let dateFormatted = moment(item.date).format(this.granularity);
            let dataItem = parseInt(item[options.keyString]) || 0;

            if (!groupedData[dateFormatted]) {
                groupedData[dateFormatted] = {
                    date: item.date,
                    dataName: options.dataName
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
        dataToNormalize = ArrayHelp.arrayNormalize(dataToNormalize, options.normalizer);

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

        return { groupedDataArr }
    }


    getChartReadyData(userOptions) {

        let options = Object.assign({
            data: this.getConvertedGroupItems(),
            granularity: this.granularity
        }, userOptions);


        // Merge all the data together
        let merged = [].concat.apply([], options.data.map(group => {
            return group.groupedDataArr;
        })).sort(ArrayHelp.sortByDate);

        let dupIndexes = ArrayHelp.arrayDups(ArrayHelp.pluck(merged, "dateFormatted"));
        let keys = ArrayHelp.mergeDedupe(ArrayHelp.pluck(merged, "dataName"));

        let mergedFormatted = [];
        let data = [];
        let labels = [];

        const getFillValue = function(prev, next, current) {
            if(!prev || !next) return current.normalizedData;
            return (prev.normalizedData + prev.normalizedData) / 2;
        }

        for (var i = 0; i < keys.length; i++) {
            let key = keys[i];
            mergedFormatted.push([]);
            merged.forEach((item, j) => {
                var newItem = Object.assign({}, item);
                if (item.dataName !== key) {
                    // var fillValue = getFillValue(merged[j-1], merged[j+1], item);
                    newItem.data = newItem.normalizedData = null; // change this to null to see data with holes
                    if(dupIndexes.indexOf(item.dateFormatted) > -1){
                        return;
                    }
                }

                mergedFormatted[i].push(newItem);

            });
            

            // Set the data and the labels
            data.push(ArrayHelp.pluck(mergedFormatted[i], "normalizedData"));
            (i == keys.length-1) && (labels = ArrayHelp.pluck(mergedFormatted[i], "dateFormatted"));
        }


        // console.log(mergedFormatted);
        return {data, labels};

    }

}



