export function PermissionDef(sequelize: any, type: any): any {
  return sequelize.define("permission", {
    id: {
      type: type.UUID,
      primaryKey: true,
      defaultValue: type.UUIDV4,
      allowNull: false,
    },
    module: {
      type: type.STRING,
      allowNull: false,
    },
    description: {
      type: type.STRING,
      allowNull: false,
    },
    function: {
      type: type.STRING,
      allowNull: false,
      unique: true,
    },
  });
}
