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

    // Deleting salesbox order ID from the comment
    Poster.orders.setOrderComment(
      activeOrder.id,
      activeOrder.comment.replace(/;\s*SalesboxOrderID:.*/, ""),
    );

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

      Poster.orders.setOrderBonus(activeOrder.id, bonusesUsed);
      // todo: change salesbox order status to accepted

      // if bonuses have been applied to the order
      // will they be overwritten by setOrderBonus or will they accumulate?
      // Lest check it

      const { approvedBonus, platformDiscount } = activeOrder;

      if (approvedBonus || platformDiscount) {
        const activeOrder = await Poster.orders.getActive();

        logError({
          approvedBonus,
          platformDiscount,
          bonusesUsed,
          activeOrder,
        });
      }
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
