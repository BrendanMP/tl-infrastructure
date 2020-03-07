import React, { Component } from "react";

import "./Legend.scss";

class Legend extends Component {
  render() {
    const legend = this.props.legend || [];

    return legend.length ? (
      <div className="Legend">
        <ul className="list-unstyled">
          {legend.map(item => (
            <li className="Legend__item" key={item.id}>
              <span
                className="Legend__item-color"
                style={{
                  backgroundColor: `rgb(${item.color[0]},${item.color[1]},${item.color[2]})`
                }}
              ></span>
              <span className="Legend__item-label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    ) : null;
  }
}

export default Legend;
