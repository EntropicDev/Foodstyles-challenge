export function UserDef(sequelize: any, type: any): any {
  return sequelize.define(
    "user",
    {
      id: {
        type: type.UUID,
        primaryKey: true,
        defaultValue: type.UUIDV4,
        allowNull: false,
      },
      name: {
        type: type.STRING,
        allowNull: false,
      },
      surname: {
        type: type.STRING,
        allowNull: false,
      },
      email: {
        type: type.STRING,
        allowNull: true,
        unique: true,
      },
      cell: {
        type: type.STRING,
        allowNull: true,
        unique: true,
      },
      land: {
        type: type.STRING,
        allowNull: true,
      },

      img: {
        type: type.STRING,
        allowNull: true,
        defaultValue: "assets/img/no-user-image.png",
      },
      pwd: {
        type: type.STRING,
        allowNull: false,
      },
      state: {
        type: type.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        validate: {
          isBoolean: true,
        },
      },
    },
    {
      defaultScope: {
        attributes: { exclude: ["pwd"] },
      },
    }
  );
}
