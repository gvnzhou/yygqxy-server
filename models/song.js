const Sequelize = require('sequelize');
const sequelize = require('../core/db');

const User = sequelize.define('mw_user', {
	id: {
		type: Sequelize.INTEGER(8),
		autoIncrement: true,
		primaryKey: true,
		unique: true,
	},
	mobile: {
		type: Sequelize.INTEGER(11),
	},
	email: {
		type: Sequelize.STRING(40),
	},
	password: {
		type: Sequelize.STRING(40),
	},
	nickname: {
		type: Sequelize.STRING(100),
	},
	avatar: {
		type: Sequelize.STRING(250),
	},
	sex: {
		type: Sequelize.INTEGER(1),
	},
	signature: {
		type: Sequelize.STRING(60),
	},
	reg_time: {
		type: Sequelize.INTEGER(13),
	},
	login_time: {
		type: Sequelize.INTEGER(13),
	},
}, {
	freezeTableName: true,
	timestamps: false,
})

module.exports = User;
