const GroupChatDAO = require("../repository/groupChatDAO");
const { mapToGroupDTO } = require("../models/dtos/groupDTO");
const { mapToGroupMemberDTO } = require("../models/dtos/groupMemberDTO");
const userService = require("../services/userService");
const { mapToUserDTO } = require("../models/dtos/userDto");

const getAll = () => {
  return GroupChatDAO.getAll();
};
const getGroupsOfUser = async (userId) => {
  return GroupChatDAO.getGroupsByUserId(userId);
};

const findOne = (groupChat) => {
  let group = mapToGroupDTO(groupChat);
  return GroupChatDAO.findOne(group);
};
const findById = (id) => {
  return GroupChatDAO.findById(id);
};

const getAllRelationalMembersDataOfUser = async (userId) => {
  try {
    let data = await GroupChatDAO.getAllRelationalMembersDataOfUser(userId);
    let res = [];
    for (const groupId of Object.keys(data)) {
      let groupData = {
        groupId: groupId,
        persons: [],
      };
      data[groupId].forEach((member) => {
        groupData.persons.push(member);
      });
      res.push(groupData);
    }

    console.log("Relational Member Datas:", res);
    return res;
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};
const getAllRelationalMembersEmailOfUser = async (userId) => {
  try {
    let data = await GroupChatDAO.getAllRelationalMembersDataOfUser(userId);
    let res = [];
    for (const groupId of Object.keys(data)) {
      let groupData = {
        groupId: groupId,
        persons: [],
      };
      for (const member of data[groupId]) {
        let user = await userService.getUserByUserId(member.userId);
        groupData.persons.push(user.email);
        res.push(groupData);
      }
    }

    console.log("Relational Member Datas:", res);
    return res;
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
};

const removeGroup = async (groupId) => {
  return GroupChatDAO.deleteById(groupId);
};
const removeMemberFromGroup = async (groupMemberData) => {
  let groupMemberDTO = mapToGroupMemberDTO(groupMemberData);
  return await GroupChatDAO.removeMemberFromGroup(
    groupMemberDTO.groupId,
    groupMemberDTO.userId
  );
};
const createGroup = async (userId, groupChatData) => {
  let groupDTO = mapToGroupDTO(groupChatData);
  let group = await GroupChatDAO.insert(groupDTO);
  let adminData = {
    userId: userId,
    isAdmin: true,
  };
  try {
    await GroupChatDAO.addGroupMemberToGroup(group._id, adminData);
    return {
      groupId: group._id,
      name: group.name,
      description: group.description,
    };
  } catch (err) {
    await GroupChatDAO.deleteById(group._id);
    throw new Error(`Create group failed! ${err}`);
  }
};

const updateGroupDetailsByAdmin = async (userId, groupChatData) => {
  let group = mapToGroupDTO(groupChatData);
  if (!(await GroupChatDAO.isGroupExists(group.groupId)))
    throw new Error("Group not exists!");
  if (!(await isMemberAdmin(userId, group.groupId)))
    throw new Error("Only admins can change group details!");
  return await GroupChatDAO.updateGroupById(group.groupId, group);
};
const isMemberAdmin = async (userId, groupId) => {
  let admins = await GroupChatDAO.getGroupAdminsOfGroup(groupId);
  console.log("Admins:", admins);
  console.log("UserId:", userId);
  for (const admin of admins) {
    if (admin._id.equals(userId)) return true;
  }
  return false;
};
//DEV
const getAllMembers = async () => {
  return await GroupChatDAO.getAllMembers();
};

const deleteAllMembers = async () => {
  return GroupChatDAO.deleteAllMembers();
};
const getAllMembersOfGroup = async (groupChatId) => {
  let isGroupExists = await GroupChatDAO.isGroupExists(groupChatId);
  if (!isGroupExists) {
    throw new Error("Group not exists!");
  }
  return await GroupChatDAO.getMembersOfGroup(groupChatId);
};
const getAllMemberDetailsOfGroup = async (groupChatId) => {
  let isGroupExists = await GroupChatDAO.isGroupExists(groupChatId);
  if (!isGroupExists) {
    throw new Error("Group not exists!");
  }
  let memberDetails = await GroupChatDAO.getMemberDetailsOfGroup(groupChatId);
  return memberDetails.map((member) => {
    return {
      name: member.userId.name,
      email: member.userId.email,
      publicKey: member.userId.public_key,
      isAdmin: member.isAdmin,
    };
  });
};
const addMemberToGroup = async (groupMemberData) => {
  let groupMember = mapToGroupMemberDTO(groupMemberData);
  return await GroupChatDAO.addGroupMemberToGroup(
    groupMember.groupId,
    groupMember
  );
};
const setAdminStatusOfMember = async (groupMemberData) => {
  let groupMember = mapToGroupMemberDTO(groupMemberData);
  return await GroupChatDAO.setAdminStatusOfMember(
    groupMember.userId,
    groupMember.isAdmin
  );
};

module.exports = {
  getAll,
  getGroupsOfUser,
  findOne,
  findById,
  createGroup,
  removeMemberFromGroup,
  updateGroupDetailsByAdmin,
  addMemberToGroup,
  removeGroup,
  deleteAllMembers,
  getAllRelationalMembersDataOfUser,
  getAllRelationalMembersEmailOfUser,
  getAllMemberDetailsOfGroup,
  getAllMembersOfGroup,
  getAllMembers,
  setAdminStatusOfMember,
};
