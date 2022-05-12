import * as React from "react";

export default class Blueprint extends React.Component {
  constructor(props) {
    super(props);
    this.bpRef = React.createRef();
  }

  componentDidMount() {
    new window.blueprintUE.render.Main(
      this.props.blueprint,
      this.bpRef.current,
      {
        height: this.props.height || "643px",
      }
    ).start();
  }

  render() {
    return (
      <>
        <div style={{ fontFamily: "Roboto, sans-serif" }} ref={this.bpRef} />
        <div
          style={{
            fontSize: "70%",
            opacity: "0.5",
            marginTop: "0.5em",
            marginBottom: "1em",
          }}
        >
          Blueprint example rendered using the{" "}
          <a href="https://blueprintue.com">blueprintue.com</a> renderer under
          an explicit license grant.
        </div>
      </>
    );
  }
}
