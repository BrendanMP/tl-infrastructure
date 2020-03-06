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
    const { legend, charts } = this.props;
    return (
      <div className="Sidebar">
        {legend ? (
          <section className="Sidebar__legend" style={{ flex: "0 0 auto" }}>
            <header>{legend.label}</header>
            <article>
              <ul className="list-unstyled mb-0">
                {legend.items.map(item => (
                  <li className="Sidebar__legend-item" key={item.id}>
                    <span
                      className="Sidebar__legend-color"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="Sidebar__legend-label">{item.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        ) : null}

        <section>
          <header>{charts.label}</header>
          <article>
            {charts.items.map(item => (
              <div className="Sidebar__chart" key={item.id}>
                {this.renderCharts(item)}
              </div>
            ))}
          </article>
        </section>
      </div>
    );
  }
}

export default Sidebar;
