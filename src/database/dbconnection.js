const Sequelize = require('sequelize');

module.exports = new Sequelize('onpointaccademy', 'salbonico@onpointaccademy', 'Steveandjer22', {
    host: 'onpointaccademy.mysql.database.azure.com',
    dialect: 'mysql'
});

