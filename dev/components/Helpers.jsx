import moment from 'moment';

/* a: expects and array */
export function sumArray(a){
    let s = 0;
    a.forEach(n => { s += parseInt(n) });
    return s / a.length;
}


/* data: expects a firebase snapshot, keyString: expects a date field in that snap shot */

const DATE_FORMATTERS = {
    YEAR: "YYYY",
    MONTH: "MMM YY",
    DAY: "ddd"
}

// TODO: dynamically change the grainularity based on the data
// see here: https://codepen.io/robertkcox/pen/LjdQoB?editors=0010
export function getConsolidatedDataValuesByDate(options) {

    let defaults = {
        data: null, 
        keyString: null, 
        grainularity: DATE_FORMATTERS.MONTH,
        duration: null
    };

    let newOptions = Object.assign(defaults, options);

    let ret = [];
    let temp = {};
    let check = {};
    let data = newOptions.data;

    for (let id in data) {
        let node = data[id];
        let k = moment(node.date).format(newOptions.grainularity);
        let item = parseInt(node[newOptions.keyString]);
        (temp[k]) ? temp[k].push(item) : (temp[k] = [item]);
    }

    for (let id in data) {
        let node = data[id];
        let k = moment(node.date).format(newOptions.grainularity);
        if(!check[k] && temp[k]) {
            ret.push({
                label: k, 
                data: sumArray(temp[k])});
            check[k] = true;
        }
    }

    return ret;
}

export default {sumArray, getConsolidatedDataValuesByDate}