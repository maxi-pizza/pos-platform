export default class BonusView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { salesboxOrder, onWithdrawBonus } = this.props;

    return (
      <form
        onSubmit={() => {
          onWithdrawBonus(salesboxOrder.bonusesUsed);
        }}
      >
        {/** using hidden input for IOS 9 input focus and onChange fix **/}
        <input type="hidden" />

        <div className="row">
          <div className="col-xs-12">
            <p>
              Користувач мобільного додатку Salesbox хоче списати{" "}
              {salesboxOrder.bonusesUsed} грн бонусів
            </p>
          </div>
        </div>

        <div className="footer">
          <div className="row">
            <div className="col-12 d-flex mt-3 justify-content-between">
              <button
                className="btn btn-lg btn-default fs-6"
                onClick={Poster.interface.closePopup}
                style={{ marginRight: 20 }}
              >
                Продовжити без списання
              </button>
              <button className="btn btn-lg btn-success fs-6" type="submit">
                Списати бонуси
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
