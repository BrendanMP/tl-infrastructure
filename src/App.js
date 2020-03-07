import React, { Component } from "react";
import axios from "axios";
import { groupBy } from "lodash";

import Map from "./components/Map/Map";
import Nav from "./components/Nav/Nav";
import Sidebar from "./components/Sidebar/Sidebar";

import MultiSelect from "./components/MultSelect/MultiSelect";

import "./scss/main.scss";

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

  _storeData(zones, points) {
    localStorage.setItem("zones", JSON.stringify(zones));
    localStorage.setItem("points", JSON.stringify(points));

    this.setState({ zones, points });
  }

  async componentDidMount() {
    try {
      const storedZones = localStorage.getItem("zones");
      const storedPoints = localStorage.getItem("points");

      if (storedZones && storedPoints) {
        this._storeData(JSON.parse(storedZones), JSON.parse(storedPoints));
      }

      const { data } = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/zones`
      );

      const poi = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/poi_v4`
      );

      await Promise.all(
        data.map(async item => {
          const items = await axios.get(
            `https://tl-socket-server.herokuapp.com/api/${item.id}`
          );

          const layers = await axios.get(
            `https://tl-socket-server.herokuapp.com/api/${item.id}_attributes_v2`
          );

          items.data.map(item => {
            item.value = item.id;
            item.value = item.id;
            return item;
          });

          item.items = items.data;

          const groups = await groupBy(layers.data, "groupid");

          item.layers = {
            active: [],
            items: layers.data,
            groups: Object.keys(groups).map((key, i) => {
              return {
                id: groups[key][0].groupid,
                value: groups[key][0].groupid,
                label: groups[key][0].grouplabel
              };
            })
          };

          return item;
        })
      );

      const zones = {
        active: {},
        items: data
      };

      if (
        data !== JSON.parse(storedZones) ||
        poi.data !== JSON.parse(storedPoints)
      ) {
        this._storeData(zones, poi.data);
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { charts, layer, legend, zones, points } = this.state;

    const layers = zones.active.layers ? zones.active.layers.groups : [];

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
          <Nav items={layers} active={layer} clicked={this._clickedNav} />
          <Map
            data={zones.active}
            points={this._filterPoints(points)}
            layer={layer}
          />
          <Sidebar legend={legend} charts={charts} />
        </main>
      </div>
    );
  }
}

export default App;
