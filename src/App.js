import React, { Component } from "react";
import axios from "axios";
import { groupBy } from "lodash";

import Map from "./components/Map/Map";
import Nav from "./components/Nav/Nav";
import Sidebar from "./components/Sidebar/Sidebar";
import Legend from "./components/Legend/Legend";

import MultiSelect from "./components/MultSelect/MultiSelect";

import "./scss/main.scss";

const COLORS = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [254, 173, 84],
  [254, 173, 84],
  [254, 173, 84],
  [254, 120, 78],
  [254, 120, 78]
];

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
      },
      charts: {
        label: "Charts Label",
        items: [
          {
            id: "chart1",
            label: "Chart 1 Label",
            type: "StackChart",
            data: {
              min: 3,
              max: 7,
              unit: "k",
              values: [
                {
                  value: 4,
                  color: "tomato"
                },
                {
                  value: 5,
                  color: "deepskyblue"
                }
              ]
            }
          },
          {
            id: "chart2",
            label: "Chart 2 Label",
            type: "StackChart",
            data: {
              min: 30,
              max: 500,
              unit: "k",
              values: [
                {
                  value: 300,
                  color: "tomato"
                },
                {
                  value: 200,
                  color: "deepskyblue"
                }
              ]
            }
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

  _createLegend() {}

  _storeData(zones, points, types) {
    this.setState({ zones, points, types });
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
          items: groups[key]
        };
      });

      this._storeData(
        {
          active: {},
          items: zones.data
        },
        points,
        nav
      );
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { charts, layer, legend, zones, points, types } = this.state;

    let foo;

    if (layer.id && layer.items) {
      foo = layer.items.map(item => {
        return {
          id: item.id,
          label: item.label,
          color: COLORS[item.typecolor]
        };
      });
    } else if (types && !layer.id) {
      foo = types.map(item => {
        return {
          id: item.id,
          label: item.label,
          color: COLORS[item.groupcolor]
        };
      });
    }

    return (
      <div className="App">
        <header>
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
            points={this._filterPoints(points)}
            layer={layer}
            legend={foo}
          />
          <Sidebar legend={legend} charts={charts} />
        </main>
        <pre
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 20,
            fontSize: 14
          }}
          className={"bg-light p-3 mb-0 d-none"}
        >
          {JSON.stringify(foo, null, 2)}
        </pre>
      </div>
    );
  }
}

export default App;
