const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const groupMemberSchema = new Schema(
  {
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  // {
  //   indexes: [{ unique: true, fields: ["userId", "groupId"] }],
  // }
);
groupMemberSchema.index({ userId: 1, groupId: 1 }, { unique: true });

var GroupMember = mongoose.model("GroupMember", groupMemberSchema);
var schemaObj = groupMemberSchema.obj;
//Export schema obj
module.exports = { GroupMember, schemaObj };
