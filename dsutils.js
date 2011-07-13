module.exports = {
  dateFormat: function dateFormat (dt) {
    var dt = dt || new Date(),
        formattedDate = dt.getUTCFullYear() + "-" + dt.getUTCMonth() + "-" + dt.getUTCDate() + " " + dt.getUTCHours() + ":" + dt.getUTCMinutes() + ":" + dt.getUTCSeconds() + " UTC";
        
    return formattedDate;
  },
  readableDate: function readableDate (dtStr) {
    var dt = new Date(dtStr);    
    return dt.toString();
  }
};