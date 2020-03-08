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

  _getPercent(total, number) {
    const result = Number(total / number) * 100;

    if (total && number) {
      return `${result.toFixed(2)}%`;
    } else {
      return "NA";
    }
  }

  render() {
    const { charts, demographics } = this.props;

    const hasItems = charts.items
      .map(item => item.data)
      .filter(item => item.length).length;

    return (
      <div className="Sidebar">
        <section>
          <header>{charts.label}</header>
          <article>
            {hasItems && charts.items.length ? (
              charts.items.map(item => (
                <div
                  className={`Sidebar__chart ${
                    !item.data.values.length ? "d-none" : null
                  }`}
                  key={item.id}
                >
                  {this.renderCharts(item)}
                </div>
              ))
            ) : (
              <div>
                {demographics.map(item => (
                  <div key={item.id} className="Demographics">
                    <div className="row">
                      <div className="col-12">
                        <div className="Demographics__name">
                          <h5>Name</h5>
                          <h4>{item.label}</h4>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="Demographics__population">
                          <h5>Population</h5>
                          <h6>{item.populationtotalcount || "NA"}</h6>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="Demographics__population">
                          <h5>Avg Family Size</h5>
                          <h6>
                            {Number(item.familysizeavg).toFixed(2) || "NA"}
                          </h6>
                        </div>
                      </div>
                      <div className="col-6 mt-3">
                        <div className="Demographics__population">
                          <h5>Male Percentage</h5>
                          <h6>
                            {this._getPercent(
                              item.populationmalecount,
                              item.populationtotalcount
                            )}
                          </h6>
                        </div>
                      </div>
                      <div className="col-6 mt-3">
                        <div className="Demographics__population">
                          <h5>Female Percentage</h5>
                          <h6>
                            {this._getPercent(
                              item.populationfemalecount,
                              item.populationtotalcount
                            )}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      </div>
    );
  }
}

export default Sidebar;
