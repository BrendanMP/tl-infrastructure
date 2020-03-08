import React, { Component } from "react";
import hexRgb from "hex-rgb";
import axios from "axios";
import { groupBy } from "lodash";

import Map from "./components/Map/Map";
import Nav from "./components/Nav/Nav";
import Sidebar from "./components/Sidebar/Sidebar";
import Legend from "./components/Legend/Legend";

import MultiSelect from "./components/MultSelect/MultiSelect";

import "./scss/main.scss";

function trimHex(hex) {
  const arr = hexRgb(hex, { format: "array" });
  arr.pop();
  return arr;
}

const COLORS = [
  trimHex("#d3ecf0"),
  trimHex("#42d4e6"),
  trimHex("#49bf9f"),
  trimHex("#fffaac"),
  trimHex("#ff9992"),
  trimHex("#ff5e52"),
  trimHex("#836bff"),
  trimHex("#c040d7"),
  trimHex("#d3ecf0"),
  trimHex("#d3ecf0"),
  trimHex("#d3ecf0")
];

const CHART_COLORS = [
  trimHex("#49bf9f"),
  trimHex("#fffaac"),
  trimHex("#ff5e52"),
  trimHex("#836bff"),
  trimHex("#c040d7")
];

const CONVERT_OPERATOR = {
  divide: function(x, y) {
    return x / y;
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zones: {
        active: {},
        items: []
      },
      layer: {},
      legend: {
        label: "Legend Label",
        items: [
          {
            id: "1",
            label: "Demo Label 1",
            color: "tomato"
          },
          {
            id: "2",
            label: "Demo Label 2",
            color: "deepskyblue"
          }
        ]
      }
    };

    this._selectZone = this._selectZone.bind(this);
    this._storeData = this._storeData.bind(this);
    this._clickedNav = this._clickedNav.bind(this);
    this._filterPoints = this._filterPoints.bind(this);
  }

  _selectZone(zone) {
    const zones = this.state.zones;
    zones.active = zone;
    this.setState({ zones });
  }

  _clickedNav(layer) {
    this.setState({ layer });
  }

  _filterPoints(points) {
    const { layer, zones } = this.state;

    const filtered = points
      ? points
          .filter(item => {
            if (layer.id && layer.id === item.groupid) {
              return true;
            }
            if (!layer.id) {
              return true;
            }
          })
          .filter(item => {
            const { active, id } = zones.active;

            const activeZones =
              active && active.length ? active.map(item => item.id) : null;

            if (activeZones) {
              return activeZones.includes(item[id]);
            }

            return true;
          })
      : null;

    return filtered || [];
  }

  _createLegend() {
    const { layer, types } = this.state;
    if (layer.id && layer.items) {
      return layer.items.map(item => {
        return {
          id: item.id,
          label: item.label,
          color: COLORS[item.typecolor]
        };
      });
    } else if (types && !layer.id) {
      return types.map(item => {
        return {
          id: item.id,
          label: item.label,
          color: COLORS[item.groupcolor]
        };
      });
    }
  }

  _createCharts() {
    const { zones, layer, points, charts } = this.state;

    let items = [];

    if (zones.active.id) {
      if (zones.active.active && zones.active.active.length) {
        items = zones.active.active;
      }
    }

    let min, max;

    return {
      label: zones.active.id ? zones.active.label : " ",
      items: charts
        ? charts
            .filter(chart => chart.groupid === layer.id)
            .map((chart, i) => {
              return {
                id: chart.id,
                label: chart.label,
                type: chart.type,
                data: {
                  min: Number(chart.min),
                  max: Number(chart.max),
                  unit: chart.unit,
                  values: items.map((item, i) => {
                    return {
                      value: item[chart.id],
                      color: CHART_COLORS[i],
                      label: item.label
                    };
                  })
                }
              };
            })
        : []
    };
  }

  _storeData(zones, points, types, charts) {
    this.setState({ zones, points, types, charts });
  }

  async componentDidMount() {
    try {
      const zones = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/zones`
      );

      const poi = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/poi_v4`
      );

      const types = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/poi_types`
      );

      const charts = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/charts`
      );

      await Promise.all(
        zones.data.map(async item => {
          const items = await axios.get(
            `https://tl-socket-server.herokuapp.com/api/${item.id}`
          );

          items.data.map(item => {
            item.value = item.id;
            item.value = item.id;
            return item;
          });

          item.items = items.data;

          return item;
        })
      );

      const points = poi.data.map(item => {
        const match = types.data.find(type => {
          return type.id === item.typeid;
        });

        item.groupcolor = COLORS[match.groupcolor];
        item.typecolor = COLORS[match.typecolor];
        return item;
      });

      const groups = groupBy(types.data, "groupid");

      const nav = Object.keys(groups).map((key, i) => {
        return {
          id: groups[key][0].groupid,
          value: groups[key][0].groupid,
          label: groups[key][0].grouplabel,
          groupcolor: groups[key][0].groupcolor,
          items: groups[key],
          disabled: groups[key][0].hidden === "TRUE" ? true : false
        };
      });

      this._storeData(
        {
          active: {},
          items: zones.data
        },
        points,
        nav,
        charts.data
      );
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { charts, layer, zones, points, types } = this.state;

    return (
      <div className="App">
        <header className="App__header">
          <MultiSelect
            selected={zones.active}
            options={zones.items}
            onChange={this._selectZone}
          />
        </header>
        <main>
          <Nav types={types} active={layer} clicked={this._clickedNav} />
          <Map
            data={zones.active}
            layer={layer}
            points={this._filterPoints(points)}
            legend={this._createLegend()}
          ></Map>
          <Sidebar charts={this._createCharts()} />
        </main>
      </div>
    );
  }
}

export default App;
