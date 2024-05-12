export const last = (arr) => {
  return arr[arr.length - 1];
};

export const extractSalesboxOrderIdFromComment = (comment) => {
  // when order is made via salesbox app then I will append salesbox order ID to the comment
  // it will look like this
  // Пін код під'їзда 5737, не телефонуйте; SalesboxOrderID: d71876ce-c3e7-4b87-be1e-283fea769ea3
  const parts = comment.split(";");
  const lastPart = last(parts);

  if (lastPart.indexOf("SalesboxOrderID") !== -1) {
    const [, orderId] = lastPart.split(":");
    return orderId.trim();
  }
  return null;
};
