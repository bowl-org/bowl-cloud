//Maps to group member DTO
const mapToGroupMemberDTO = (groupMemberData) => {
  try {
    let groupMember = {
      groupId: groupMemberData?.groupId,
      userId: groupMemberData?.userId,
      isAdmin: groupMemberData?.isAdmin,
    };
    return groupMember;
  } catch (err) {
    throw err;
  }
};
module.exports = { mapToGroupMemberDTO };
