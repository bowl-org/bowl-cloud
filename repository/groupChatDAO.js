const { Group } = require("../models/entities/group");
const { GroupMember } = require("../models/entities/groupMember");
const UserDAO = require("./userDAO");

const getAll = () => {
  return Group.find({});
};
const getGroupsByUserId = async (userId) => {
  return GroupMember.find({ userId: userId }).distinct("groupId");
};

const findOne = (groupChat) => {
  return new Promise((resolve, reject) => {
    Group.findOne(groupChat).then((chat) => {
      //null or undefined
      if (chat == null) {
        reject(new Error("Group does not exists!"));
      } else {
        resolve(chat);
      }
    });
  });
};
const getGroupAdminsOfGroup = async (groupId) => {
  let adminIds = await GroupMember.find({ groupId: groupId })
    .where("isAdmin")
    .equals(true)
    .distinct("userId")
    .lean();
  let adminsOfGroup = await UserDAO.findByIds(adminIds);
  console.log("admin ids:", adminIds);
  console.log("admins:", adminsOfGroup);
  return adminsOfGroup;
};

const getAllMembers = async () => {
  let groupMembers = await GroupMember.find();
  if (groupMembers == null) {
    throw new Error("There isn't any member!");
  }
  return groupMembers;
};
const getMembersOfGroup = async (groupId) => {
  let groupMembers = await GroupMember.find({ groupId: groupId });
  if (groupMembers == null) {
    throw new Error("There isn't any member of group!");
  }
  return groupMembers;
};
const getMemberDetailsOfGroup = async (groupId) => {
  // let groupMemberIds = await GroupMember.find({ groupId: groupId }).distinct("userId").lean();
  // return await UserDAO.findByIds(groupMemberIds);
  return GroupMember.find({ groupId }).populate({
    path: "userId",
    select: "name email public_key",
  });
};

const getAllRelationalMembersDataOfUser = async (userId) => {
  let relationalMembersData = {};
  let groupIds = await GroupMember.find({ userId: userId }).distinct("groupId");
  // if (groupIds.length == 0) throw new Error("User is not member of any group!");
  let relationalGroupMembers = await GroupMember.find({
    groupId: { $in: groupIds },
    userId: { $ne: userId },
  }).lean();
  console.log("RelationalgroupMembers:", relationalGroupMembers);
  for (const groupMember of relationalGroupMembers) {
    const groupId = groupMember.groupId;
    if (!relationalMembersData[groupId]) {
      relationalMembersData[groupId] = [];
    }
    relationalMembersData[groupId].push(groupMember);
  }
  return relationalMembersData;
};

const removeMemberFromGroup = async (groupId, userId) => {
  let isDeleted = await GroupMember.findByIdAndDelete(userId)
    .where("grupId")
    .equals(groupId);
  if (!isDeleted)
    throw new Error("Member remove failed! Member not found in group!");
};
const setAdminStatusOfMember = async (userId, isAdmin) => {
  let member = await GroupMember.findByIdAndUpdate(userId, {
    isAdmin: isAdmin,
  });
  if (!member)
    throw new Error(
      "Set admin status of member failed! Member not found in group!"
    );
};
const findAll = (group) => {
  return new Promise((resolve, reject) => {
    Group.find(group).then((chat) => {
      //null or undefined
      if (chat == null) {
        reject(new Error("There isn't any Group!"));
      } else {
        resolve(chat);
      }
    });
  });
};

const deleteAllGroups = () => {
  return Group.remove({});
};
const deleteAllMembers = () => {
  return GroupMember.remove({});
};
const findById = (id) => {
  return Group.findById(id);
};
const insert = async (groupDTO) => {
  return Group.create(groupDTO);
};
const updateGroupById = async (id, data) => {
  let group = await Group.findByIdAndUpdate(id, data);
  console.log("Updated group:", group);
  if (!group) throw new Error("Group update failed! Group id not found");
  return group;
};

const deleteById = async (groupId) => {
  let isDeleted = await Group.findByIdAndRemove(groupId);
  if (!isDeleted) throw new Error("Group delete failed! Group id not found");
  await GroupMember.deleteMany({ groupId: groupId });
};
const addGroupMemberToGroup = async (groupId, groupMemberDTO) => {
  groupMemberDTO.groupId = groupId;
  console.log("groupMember add:", groupMemberDTO);
  try {
    return await GroupMember.create(groupMemberDTO);
  } catch (err) {
    //Duplication error code
    if (err?.code == 11000) {
      console.log("Group member already in group!");
      return await GroupMember.findOne({
        groupId: groupMemberDTO.groupId,
        userId: groupMemberDTO.userId,
      });
    } else {
      throw err;
    }
  }
};
const isGroupExists = async (groupId) => {
  return (await Group.exists({ _id: groupId }).exec()) != null;
};

module.exports = {
  getAll,
  getAllMembers,
  getMembersOfGroup,
  getMemberDetailsOfGroup,
  getGroupsByUserId,
  getAllRelationalMembersDataOfUser,
  removeMemberFromGroup,
  setAdminStatusOfMember,
  findOne,
  findAll,
  updateGroupById,
  getGroupAdminsOfGroup,
  deleteAllGroups,
  deleteAllMembers,
  findById,
  insert,
  deleteById,
  addGroupMemberToGroup,
  isGroupExists,
};
