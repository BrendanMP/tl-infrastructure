import React, { Component } from "react";

import StackChart from "../StackChart/StackChart";

import "./Sidebar.scss";

class Sidebar extends Component {
  renderCharts(item) {
    switch (item.type) {
      case "StackChart":
        return <StackChart key={item} chart={item} />;
      default:
        return null;
    }
  }

  render() {
    const { charts } = this.props;

    console.log(charts);
    return (
      <div className="Sidebar">
        <section>
          <header>{charts.label}</header>
          <article>
            {charts.items.length
              ? charts.items.map(item => (
                  <div
                    className={`Sidebar__chart ${
                      !item.data.values.length ? "d-none" : null
                    }`}
                    key={item.id}
                  >
                    {this.renderCharts(item)}
                  </div>
                ))
              : null}
          </article>
        </section>
      </div>
    );
  }
}

export default Sidebar;
