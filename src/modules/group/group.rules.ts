export const create = {
  name: "required|string",
  admin: "boolean",
};
export const update = {
  id: "required|string",
  name: "required|string",
  admin: "boolean",
};
export const getOne = {
  id: "required|string",
};
export const deleteRule = {
  id: "required|string",
};
export const groupIdExists = {
  id: "required|string",
};
export const groupIdsExists = {
  groupIds: "required|string",
};
export const uuidExists = {
  uuid: "required|string",
};
export const addMember = {
  id: "required|string",
  uuid: "required|string",
};
export const deleteMember = {
  id: "required|string",
  uuid: "required|string",
};
