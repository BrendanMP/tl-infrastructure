import React, { Component } from "react";

import "./Nav.scss";

class Nav extends Component {
  render() {
    const { items } = this.props;

    return (
      <div className="Nav d-flex flex-column justify-content-center">
        <ul className="list-unstyled">
          {items.length
            ? items.map(item => (
                <li key={item.id}>
                  <button className="btn btn-block text-left">
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
