import {
  authenticate as authenticateSalesbox,
  getOrder as getSalesboxOrder,
} from "../salesbox.api.js";
import { extractSalesboxOrderIdFromComment } from "../utils.js";
import { logError } from "../maxipizza.api.js";

// authenticate asynchronously as early as possible
authenticateSalesbox();

export default class LoyaltyApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  checkForCashback = async (data, next) => {
    const { incomingOrder, order: activeOrder } = data;

    const orderId = extractSalesboxOrderIdFromComment(incomingOrder.comment);

    if (!orderId) {
      // the order comment doesn't contain salesbox order id
      // this means the order wasn't made via salesbox app
      return;
    }

    try {
      const salesboxOrder = await getSalesboxOrder(orderId);

      const bonusesUsed = salesboxOrder.bonusesUsed;

      if (!bonusesUsed) {
        // the salesbox user hasn't applied any bonuses to the order
        // short-circuiting
        return;
      }

      const { approvedBonus, platformDiscount } = activeOrder;
      // Can the order have bonuses applied before it was accepted?
      // I expect it can't
      if (!approvedBonus || !platformDiscount) {
        // notify me if I'm wrong
        logError({
          approvedBonus,
          platformDiscount,
        });
      }

      // if the order had previously applied bonuses
      // will they be overwritten by setOrderBonus or will they accumulate?
      Poster.orders.setOrderBonus(activeOrder.id, bonusesUsed);
    } catch (error) {
      logError({
        error: error.message,
        stack: error.stack,
        response: error.response,
        request: error.request,
      });
    } finally {
      next();
    }
  };

  componentDidMount() {
    Poster.on("incomingOrderAccepted", this.checkForCashback);
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
