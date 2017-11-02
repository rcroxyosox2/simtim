export default class ArrayHelp {

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
        return Object.keys(obj).filter((f) => {
            var item = obj[f][key];
            if(!item || (where && item != where)){
                return false;
            }
            return true;
        }).map((f) => {
            var item = obj[f][key];
            return item;
        })
    }

    static dedupOnKey(arr, key) {
        let found = [];
        return arr.filter((item)=>{
            let val = item[key];
            let isDup = found.indexOf(val) > -1;
            found.push(val);
            return !isDup;
        });
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

    // used on a.sort
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