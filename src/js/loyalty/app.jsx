import BonusView from "./bonus.jsx";
import { getOrder as getSalesboxOrder } from "../salesbox.api.js";

export default class LoyaltyApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePopupId: null, // доступні варіанти: bonus
      posterOrder: null,
      salesboxOrder: null,
    };
  }

  handleBeforeOrderClose = async (data, next) => {
    // Сохранили callback чтобы закрыть заказ
    this.next = next;
    const orderId = "d71876ce-c3e7-4b87-be1e-283fea769ea3";
    try {
      const [salesboxOrder, posterOrder] = await Promise.all([
        getSalesboxOrder(orderId),
        Poster.orders.getActive().then((response) => response.order),
      ]);

      this.setState({
        activePopupId: "bonus",
        salesboxOrder,
        posterOrder,
      });

      Poster.interface.popup({
        width: 500,
        height: 300,
        title: "Списання бонусів",
      });
    } catch (e) {
      console.log(`Замовлення #${orderId} не знайдено`);
      this.next();
    }
  };

  componentDidMount() {
    Poster.on("beforeOrderClose", this.handleBeforeOrderClose);
  }

  withdrawBonus = (bonus) => {
    const { posterOrder } = this.state;

    Poster.orders.setOrderBonus(posterOrder.id, parseFloat(bonus));
    Poster.interface.closePopup();

    this.next();
  };

  render() {
    const { activePopupId, salesboxOrder, posterOrder } = this.state;

    if (activePopupId === "bonus") {
      return (
        <BonusView
          salesboxOrder={salesboxOrder}
          posterOrder={posterOrder}
          onWithdrawBonus={this.withdrawBonus}
        />
      );
    }

    return <div />;
  }
}
