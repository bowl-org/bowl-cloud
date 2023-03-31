const getTimestamp = () => {
  let d = new Date();
  return (
    "[ " +
    d.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" }) +
    " - " +
    d.toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul" }) +
    " ] "
  );
};

module.exports = { getTimestamp };
