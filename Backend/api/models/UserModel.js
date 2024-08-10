'use strict';

module.exports = function (sequelize, DataTypes) {
    const UserModel = sequelize.define('UserModel', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        verification_token: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        profile_pic_hash: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        profile_pic_ext: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        status: {
            type: DataTypes.ENUM('active', 'pending', 'suspended', 'cancelled'),
            allowNull: false,
            defaultValue: 'active'
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
    }, {
        tableName: 'users'
    });

    return UserModel;
};