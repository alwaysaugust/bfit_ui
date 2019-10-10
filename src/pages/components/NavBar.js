import React, { Fragment } from "react";
import {
  withStyles,
  Typography,
  IconButton,
  Popper,
  Paper
} from "@material-ui/core";
import ProfileIcon from "../../res/profile_icon.svg";
import CloseIcon from "../../res/close_icon.svg";
const styles = theme => ({
  root: {
    background: "white",
    position: "fixed",
    zIndex: 1,
    width: "100%",
    height: "50px"
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100vw",
    height: "100vh",
    position: "fixed"
  },
  header: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: "1.9em",
    position: "relative",
    marginTop: "7px"
  },
  dropdownButton: {
    position: "fixed",
    right: "5%",
    top: 0
  },
  popper: {
    marginTop: "7px",
    zIndex: 1,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "0 1em 1em 1em",
        borderColor: `transparent transparent ${theme.palette.common.white} transparent`
      }
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: "-0.9em",
      width: "3em",
      height: "1em",
      "&::before": {
        borderWidth: "1em 1em 0 1em",
        borderColor: `${theme.palette.common.white} transparent transparent transparent`
      }
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 1em 1em 0",
        borderColor: `transparent ${theme.palette.common.white} transparent transparent`
      }
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: "-0.9em",
      height: "3em",
      width: "1em",
      "&::before": {
        borderWidth: "1em 0 1em 1em",
        borderColor: `transparent transparent transparent ${theme.palette.common.white}`
      }
    }
  },
  arrow: {
    position: "absolute",
    fontSize: 7,
    width: "3em",
    height: "3em",
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid"
    }
  },
  dropDownContent: {
    minWidth: "10vh",
    minHeight: "10vh"
  }
});
class NavBar extends React.Component {
  state = {
    open: false,
    anchorRef: null
  };
  async componentDidMount() {}
  onClick = e => {
    this.setState({ anchorRef: this.state.anchorRef ? null : e.currentTarget });
  };
  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <div className={classes.root}>
          <Typography className={classes.header} variant="h5">
            BFIT
          </Typography>
          <IconButton
            aria-label="delete"
            className={classes.dropdownButton}
            ref={this.buttonRef}
            onClick={this.onClick}
          >
            <img
              alt="dropdown icon"
              width="25px"
              height="25px"
              src={this.state.anchorRef ? CloseIcon : ProfileIcon}
            />
          </IconButton>
        </div>
        <Popper
          placement="bottom-end"
          open={this.state.anchorRef !== null}
          anchorEl={this.state.anchorRef}
          className={classes.popper}
          disablePortal={false}
          modifiers={{
            flip: {
              enabled: false
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: "undefined"
            },
            arrow: {
              enabled: true,
              element: this.state.arrowRef
            }
          }}
        >
          <span className={classes.arrow} ref={this.handleArrowRef} />
          <Paper className={classes.dropDownContent}>Text</Paper>
        </Popper>
        {this.state.anchorRef !== null ? (
          <div onClick={this.onClick} className={classes.overlay} />
        ) : null}
      </Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NavBar);