//Maps to private chat DTO
const mapToPrivateChatDTO = (privateChatData) => {
  try {
    let privateChat = {
      user1Id: privateChatData.user1Id,
      user2Id: privateChatData.user2Id,
      active: privateChatData.active,
    };
    return privateChat;
  } catch (err) {
    throw err;
  }
};
module.exports = { mapToPrivateChatDTO };
