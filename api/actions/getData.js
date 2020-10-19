const { missingParamsErr, invalidRequestErr } = require("../../util/errors");

// must include sid
const validParams = data => !!data && !!data.type;

// GET_DATA
async function getData({ data, rtDB }) {
  if (!validParams(data)) return missingParamsErr("type");

  switch (data.type) {
    case "active-cards":
      return rtDB.cards;

    case "submitted-cards":
      return { error: "not implemented yet" };

    default:
      return invalidRequestErr("Unknown data type");
  }
}

module.exports = getData;
