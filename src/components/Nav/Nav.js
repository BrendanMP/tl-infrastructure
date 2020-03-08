import React, { Component } from "react";

import "./Nav.scss";

class Nav extends Component {
  render() {
    const { types, clicked, active } = this.props;
    return (
      <div className="Nav d-flex flex-column justify-content-center">
        <div>
          {types && types.length ? (
            <ul className="list-unstyled">
              <li>
                <button
                  className={`btn btn-block text-left ${
                    !active.id ? "active" : ""
                  }`}
                  onClick={() => clicked({})}
                >
                  All
                </button>
              </li>
              {types.map(item => (
                <li key={item.id}>
                  <button
                    className={`btn btn-block text-left ${
                      active.id === item.id ? "active" : ""
                    }`}
                    onClick={() => clicked(item)}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-muted">Loading...</div>
          )}
        </div>
      </div>
    );
  }
}

export default Nav;
