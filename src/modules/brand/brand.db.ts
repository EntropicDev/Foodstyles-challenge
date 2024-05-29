export function BrandDef(sequelize: any, type: any): any {
  return sequelize.define(
    "brand",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: type.STRING,
        allowNull: false,
        unique: true,
      },
      //Exclude created at and updated at from queries
    },
    {
      defaultScope: {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    }
  );
}
