export const create = {
  name: "required|string",
  surname: "required|string",
  email: "string",
  pwd: "required|string",
  cell: ["required", "regex:/^0[6-9][0-9]{8}$/"],
};
export const update = {
  id: "required|string",
  name: "string",
  surname: "string",
  email: "string",
  cell: ["regex:/^0[6-9][0-9]{8}$/"],
};
export const getOne = {
  id: "required|string",
};
export const deleteRule = {
  id: "required|string",
};
export const emailQuery = {
  email: "required|string",
};
export const idExists = {
  id: "required|string",
};
