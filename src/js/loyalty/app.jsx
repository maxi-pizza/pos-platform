import { getOrder, logError } from "../restaurant";
import React from "react";

export default class LoyaltyApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  checkBonuses = async (data, next) => {
    const { incomingOrder, order } = data;
    const orderId = incomingOrder.id;
    try {
      const bonuses = await getOrder(orderId);
      Poster.orders.setOrderBonus(order.id, bonuses.to_use);
    } catch (e) {
      console.warn(e.message);
      logError({
        error: e.message,
        stack: e.stack,
        response: e.response,
        request: e.request,
      });
    } finally {
      next();
    }
  };

  componentDidMount() {
    Poster.on("incomingOrderAccepted", this.checkBonuses);
    Poster.on("beforeOrderClose", (data, next) => {
      // I don't know why but when order is about to be closed
      // weird popup appears on the screen
      // To fix this I will close any popup that could open
      Poster.interface.closePopup();
      next();
    });
  }

  render() {
    return <div />;
  }
}
