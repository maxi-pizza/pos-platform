import { authenticate, getOrder as getSalesboxOrder } from "../salesbox.api.js";
import { extractSalesboxOrderIdFromComment } from "../utils.js";

// authenticate asynchronously
authenticate();

export default class LoyaltyApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  checkForCashback = async (data, next) => {
    const { incomingOrder, order: activeOrder } = data;

    const orderId = extractSalesboxOrderIdFromComment(incomingOrder.comment);

    if (!orderId) {
      // order comment doesn't contain salesbox order id
      // it means this order wasn't made via salesbox app
      return;
    }

    try {
      const salesboxOrder = await getSalesboxOrder(orderId);

      const bonusesUsed = salesboxOrder.bonusesUsed;

      if (!bonusesUsed) {
        // a user hasn't applied any bonuses to the order
        return;
      }

      Poster.orders.setOrderBonus(activeOrder.id, bonusesUsed);
    } catch (e) {
      // todo: log errors
      console.log(e);
    } finally {
      next();
    }
  };

  componentDidMount() {
    Poster.on("incomingOrderAccepted", this.checkForCashback);
    Poster.on("beforeOrderClose", (data, next) => {
      Poster.interface.closePopup();
      next();
    });
  }

  render() {
    return <div />;
  }
}
