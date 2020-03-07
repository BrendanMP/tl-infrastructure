import React, { Component } from "react";
import { groupBy } from "lodash";

import "./Nav.scss";

class Nav extends Component {
  render() {
    const { types, clicked, active } = this.props;

    const groups = groupBy(types, "groupid");

    const items = Object.keys(groups).map((key, i) => {
      return {
        id: groups[key][0].groupid,
        value: groups[key][0].groupid,
        label: groups[key][0].grouplabel
      };
    });

    return (
      <div className="Nav d-flex flex-column justify-content-center">
        <ul className="list-unstyled">
          {items && items.length
            ? items.map(item => (
                <li key={item.id}>
                  <button
                    className={`btn btn-block text-left ${
                      active.id === item.id ? "active" : ""
                    }`}
                    onClick={() => clicked(item)}
                  >
                    {item.label}
                  </button>
                </li>
              ))
            : null}
        </ul>
      </div>
    );
  }
}

export default Nav;
