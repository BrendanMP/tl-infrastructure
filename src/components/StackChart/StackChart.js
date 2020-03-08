import React, { Component } from "react";

import "./StackChart.scss";

class StackChart extends Component {
  getWidth(min, max, value) {
    return `${(value / max) * 100}%`;
  }
  render() {
    const { chart } = this.props;
    const { min, max, values, unit } = chart.data;
    return (
      <div className="StackChart">
        <header className={"mb-1"}>{chart.label}</header>
        <article>
          {values.map((item, i) => (
            <div key={`${item.id}-${i}`}>
              <div className="StackChart__bar-text">{item.label}</div>
              <div className="StackChart__bar" key={`${item}_${i}`}>
                <div
                  className="StackChart__bar-inner text-white"
                  style={{
                    backgroundColor: `rgb(${item.color[0]},${item.color[1]},${item.color[2]})`,
                    width: this.getWidth(min, max, item.value)
                  }}
                >
                  &nbsp;
                </div>
              </div>
            </div>
          ))}
        </article>
        <footer className="d-flex justify-content-between">
          <span>{min + unit} (Min)</span>
          <span>{max + unit} (Max)</span>
        </footer>
      </div>
    );
  }
}

export default StackChart;
