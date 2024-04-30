export function GroupDef(sequelize: any, type: any): any {
  return sequelize.define("group", {
    id: {
      type: type.UUID,
      primaryKey: true,
      defaultValue: type.UUIDV4,
      allowNull: false,
    },
    name: {
      type: type.STRING,
      allowNull: false,
      unique: true,
    },
    admin: {
      type: type.BOOLEAN,
      allowNull: false,
      validate: {
        isBoolean: true,
      },
    },
  });
}
