//Maps to group DTO
const mapToGroupDTO = (groupData) => {
  try {
    let group = {
      groupId: groupData?.groupId,
      name: groupData?.name,
      description: groupData?.description,
    };
    return group;
  } catch (err) {
    throw err;
  }
};
module.exports = {mapToGroupDTO};
