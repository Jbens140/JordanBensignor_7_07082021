const fs = require("fs")
const path = require("path")
const Sequelize = require("sequelize")
const basename = path.basename(__filename)
require("dotenv").config({ path: process.cwd() + "/.env" })
const db = {}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST, dialect: "mysql", port: process.env.DB_PORT })

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === ".js")
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

db.users = require("./User.js")(sequelize, Sequelize)
db.messages = require("./Message.js")(sequelize, Sequelize)
db.comments = require("./Comment.js")(sequelize, Sequelize)

db.comments.belongsTo(db.messages)
db.comments.belongsTo(db.users)
db.messages.hasMany(db.comments)
db.messages.belongsTo(db.users)
db.users.hasMany(db.messages)
db.users.hasMany(db.comments)

module.exports = db