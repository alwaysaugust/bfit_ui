import React, { Fragment } from "react";
import {
  withStyles,
  Grid,
  AppBar,
  Tabs,
  Tab,
  GridList
} from "@material-ui/core";
import NavBar from "./components/NavBar";
import RewardCell from "./components/RewardCell";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import compose from "recompose/compose";
import PointsWidget from "./components/PointsWidget";
import { withRouter } from "react-router-dom";
import moment from "moment";
import EmptyListPlaceholder from "./components/EmptyListPlaceholder";
const styles = theme => ({
  root: {
    margin: "0 auto 0 auto",
    padding: "35px 0 10vh 0",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      padding: "50px 0 80px 0"
    }
  },
  gridListContainer: {},
  footer: {
    "& button": theme.buttons.primary,
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#032F41",
    padding: "15px",
    textAlign: "center"
  },
  wideButton: {
    minWidth: "30%!important",
    [theme.breakpoints.down("sm")]: {
      minWidth: "90%!important",
      paddingLeft: "5vw",
      paddingRight: "5vw"
    }
  },
  tabBar: {
    background: "white",
    color: "#032F41",
    boxShadow: "none",
    borderTop: "1px solid rgba(243,243,243,100)",
    zIndex: 0
  },
  tab: {
    width: "50%"
  },
  page: {
    marginTop: "20px",
    paddingLeft: "10vw",
    paddingRight: "10vw",
    justifyContent: "space-around",
    background: "linear-gradient(to top, #F1F8F9 85%, transparent)",
    width: "100%",
    "& ul": {
      width: "100%",
      height: "100%"
    },
    [theme.breakpoints.down("sm")]: {
      background: "#F1F8F9"
    }
  },
  pointsWidget: {
    width: "100vw",
    [theme.breakpoints.down("sm")]: {
      width: "100vw"
    }
  },
  indicator: {
    backgroundColor: "#032F41"
  },
  rewardCell: {
    width: "23%",
    margin: "1%",
    [theme.breakpoints.down("sm")]: {
      width: "100vw"
    }
  }
});

class DashboardVendor extends React.Component {
  state = {
    pointsConverted: false,
    missingUserRole: true,
    value: 0,
    expiredListItems: [],
    listItems: []
  };
  async componentDidMount() {
    const resp = await this.props.api.get(
      `/getRewards?vendorId=${this.props.user["_id"]}`
    );
    if (resp.data.error) {
      alert("could not load rewards");
    } else {
      let expiredListItems = [];
      let listItems = [];
      resp.data.data.forEach(item => {
        let itemModel = {
          id: item["_id"],
          title: item.title,
          img: item.image
            ? this.props.API_URL + "/" + item.image
            : "missingImage.svg",
          points: item.cost,
          icon: item.creatorLogo
            ? this.props.API_URL + "/" + item.creatorLogo
            : "missingImage.svg",
          endTime: item.expirationDate
        };
        if (item.expirationDate < moment().unix()) {
          expiredListItems.push(itemModel);
        } else {
          listItems.push(itemModel);
        }
      });
      this.setState({ listItems, expiredListItems });
    }
  }
  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };
  a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`
    };
  }
  handleOnClick = id => {
    this.props.history.push(`/reward?id=${id}&admin=true`);
  };
  onPointsClick = () => {
    if (this.props.id) {
      this.props.history.push(`/createUpdateReward?id=${this.props.id}`);
    } else {
      this.props.history.push(`/createUpdateReward`);
    }
  };
  render() {
    const { classes, width, history, user, API_URL } = this.props;
    const { value, expiredListItems, listItems } = this.state;
    const smallScreen = !isWidthUp("md", width);
    let points = 0;
    user.vendorRedemptions.forEach(red => {
      points += red.cost;
    });
    let listItemsViews = listItems.map((item, index) => (
      <RewardCell
        onClick={() => {
          this.handleOnClick(item.id); //todo update
        }}
        key={index}
        tile={item}
        className={classes.rewardCell}
      ></RewardCell>
    ));
    let expiredListItemsViews = expiredListItems.map((item, index) => {
      return (
        <RewardCell
          onClick={() => {
            this.handleOnClick(item.id); //todo update
          }}
          key={index}
          tile={item}
          className={classes.rewardCell}
        ></RewardCell>
      );
    });
    return (
      <Fragment>
        <NavBar history={history} admin={true} />
        <Grid
          className={classes.root}
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
        >
          <PointsWidget
            onPointsClick={this.onPointsClick}
            className={classes.pointsWidget}
            buttonLabel="Create Reward Program"
            disableButton={user.vendorData.status !== 1}
            extraMessage={
              !user.vendorData.status || user.vendorData.status === 0 ? (
                <span>Your application is pending</span>
              ) : !user.vendorData.status || user.vendorData.status === 2 ? (
                <span>
                  You have been rejected.{" "}
                  <a style={{ color: "pink" }} href={`${API_URL}/changeRole`}>
                    Change role?
                  </a>
                </span>
              ) : null
            }
            contentItems={[{ number: points, text: "Total SWEATS Redeemed" }]}
          />

          <Fragment>
            <AppBar className={classes.tabBar} position="static">
              <Tabs
                centered
                value={value}
                onChange={this.handleChange}
                aria-label="simple tabs example"
                classes={{
                  indicator: classes.indicator
                }}
              >
                <Tab
                  className={classes.tab}
                  label="Active"
                  {...this.a11yProps(0)}
                />
                <Tab
                  className={classes.tab}
                  label="Expired"
                  {...this.a11yProps(1)}
                />
              </Tabs>
            </AppBar>
            <Grid
              item
              className={classes.page}
              hidden={value !== 0}
              value={value}
              index={0}
            >
              <GridList cellHeight={110} cols={smallScreen ? 1 : 4}>
                {listItemsViews.length > 0 ? (
                  listItemsViews
                ) : (
                  <EmptyListPlaceholder
                    title="No Items"
                    details="Create a reward to see it here"
                  />
                )}
              </GridList>
            </Grid>
            <Grid
              item
              className={classes.page}
              hidden={value !== 1}
              value={value}
              index={1}
            >
              <GridList cellHeight={110} cols={smallScreen ? 1 : 4}>
                {expiredListItemsViews.length > 0 ? (
                  expiredListItemsViews
                ) : (
                  <EmptyListPlaceholder
                    title="No Expired Items"
                    details="Expired rewards will show up here "
                  />
                )}
              </GridList>
            </Grid>
          </Fragment>
        </Grid>
      </Fragment>
    );
  }
}

export default withRouter(
  compose(
    withStyles(styles, { name: "DashboardVendor", withTheme: true }),
    withWidth()
  )(DashboardVendor)
);
