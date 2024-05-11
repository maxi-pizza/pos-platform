export default class BonusView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  updateInput = (e) => {
    let { id, value } = e.target;
    this.setState({ [id]: value });
  };

  render() {
    let { bonus } = this.state;
    const { salesboxOrder, onWithdrawBonus } = this.props;

    return (
      <form
        onSubmit={() => {
          debugger;
          onWithdrawBonus(this.state.bonus);
        }}
      >
        {/** using hidden input for IOS 9 input focus and onChange fix **/}
        <input type="hidden" />

        <div className="row">
          <div className="col-xs-12">
            <p>
              Користувач хоче списати {salesboxOrder.bonusesUsed} грн бонусів
            </p>

            <label htmlFor="bonus">Списати</label>
            <input
              type="text"
              placeholder="10.99 грн"
              id="bonus"
              defaultValue={salesboxOrder.bonusesUsed}
              className="form-control"
              value={bonus}
              onChange={this.updateInput}
            />
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
