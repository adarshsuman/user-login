var config = require('./config');
module.exports = {
    getConnection : function(){
        return "mongodb://127.0.0.1:27017/"+config.databaseName;
    }
}