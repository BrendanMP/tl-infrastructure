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
  }

  _selectZone(zone) {
    const zones = this.state.zones;
    zones.active = zone;
    this.setState({ zones });
  }

  _clickedNav(layer) {
    this.setState({layer})
  }

  _storeData(zones, poi) {
    this.setState({ zones, poi });
  }

  async componentDidMount() {
    try {
      const { data } = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/zones`
      );

      const poi = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/poi_v3`
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

      this._storeData(zones, poi.data)
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { legend, charts, zones, poi, layer } = this.state;

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
          <Nav items={zones.active.layers ? zones.active.layers.groups : []} clicked={this._clickedNav} active={layer} />
          <Map data={zones.active} poi={poi ? poi : []} layer={layer} />
          <Sidebar legend={legend} charts={charts} />
        </main>
      </div>
    );
  }
}

export default App;
