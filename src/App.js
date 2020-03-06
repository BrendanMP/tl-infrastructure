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

    this.selectZone = this.selectZone.bind(this);
    this._storeData = this._storeData.bind(this);
  }

  selectZone(zone) {
    const zones = this.state.zones;
    zones.active = zone;
    this.setState({ zones });
  }

  _storeData(data) {
    this.setState({ zones: data });
  }

  async componentDidMount() {
    try {
      const { data } = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/zones`
      );

      const poi = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/poi_v2`
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

      this.setState({ zones, poi: poi.data });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { legend, charts, zones, poi } = this.state;

    console.log(poi);

    return (
      <div className="App">
        <header>
          <MultiSelect
            selected={zones.active}
            options={zones.items}
            onChange={this.selectZone}
          />
        </header>
        <main>
          <Nav items={zones.active.layers ? zones.active.layers.groups : []} />
          <Map data={zones.active} poi={poi ? poi : []} />
          <Sidebar legend={legend} charts={charts} />
        </main>
      </div>
    );
  }
}

export default App;
