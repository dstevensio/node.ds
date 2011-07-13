// INCR ID FOR what 
module.exports = {
  writeNew: function writeNew (where, what) {    
    client.incr("global:ids:last:"+where, what);
  }

};