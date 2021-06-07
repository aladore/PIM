import { Tools } from "@/utils/Tools";

/**
 * Generate a link to open maps application
 * @param {string} value a postal address
 * @return {string} link
 */
export function geolink(value) {
    const type = 1;

    value = value.replace(/,/g, " ");
    if (!Tools.isAndroid()) {
        // Geo Proto is KO on Apple
        let hostname = "maps.google.com";
        if (Tools.isApple()) {
            hostname = "maps.apple.com";
        }

        if (type === 1) {
            // query
            value = "http://" + hostname + "/?q=" + value.replace(/ /g, "+");
        } else {
            // latitude, longitude
            //Ex:  saddr=44.834138,-0.598639&daddr=47.566099,-0.331209
            // value = 'http://'+hostname+'/?saddr='+cw.gloc._current.latitude+','+cw.gloc._current.longitude+'&daddr='+value;
        }
    } else {
        // Android proto geo is OK
        // q=address ou coordinates
        value = "geo:0,0?q=" + value.replace(/ /g, "+");
        //~ if (type) {
        //~ // query
        //~ g = 'geo:0,0?q='+value.replace(/ /g, "+");
        //~ } else {
        //~ // latitude, longitude
        //~ g = 'geo:'+value;
        //~ }
    }

    return value;
}
