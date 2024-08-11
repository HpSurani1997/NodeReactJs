'use strict';

module.exports = function (sequelize, DataTypes) {
    const ProfileModel = sequelize.define('ProfileModel', {
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // The name of the User table in your database
                key: 'id'
            }
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
        tableName: 'profiles'
    });

    // Set up the association
    ProfileModel.associate = function (models) {
        ProfileModel.belongsTo(models.UserModel, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return ProfileModel;
};
