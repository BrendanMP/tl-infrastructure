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
        <header>{chart.label}</header>
        <article>
          <div>
            {values.map((item, i) => (
              <div className="StackChart__bar" key={`${item}_${i}`}>
                <div
                  className="StackChart__bar-inner text-white"
                  style={{
                    backgroundColor: item.color,
                    width: this.getWidth(min, max, item.value)
                  }}
                >
                  {item.value}
                  {unit}
                </div>
              </div>
            ))}
          </div>
        </article>
        <footer className="d-flex justify-content-between">
          <span>{min + unit}</span>
          <span>{max + unit}</span>
        </footer>
      </div>
    );
  }
}

export default StackChart;
