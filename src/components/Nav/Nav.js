import React, { Component } from "react";

import "./Nav.scss";

class Nav extends Component {
  render() {
    const { types, clicked, active } = this.props;
    return (
      <div className="Nav d-flex flex-column justify-content-center">
        <ul className="list-unstyled">
          {types && types.length
            ? types.map(item => (
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
