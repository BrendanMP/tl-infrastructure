import React, { Component } from "react";
import DeckGL, {
  FlyToInterpolator,
  GeoJsonLayer,
  MapController,
  ScatterplotLayer,
  WebMercatorViewport
} from "deck.gl";
import { DataFilterExtension } from "@deck.gl/extensions";
import { StaticMap } from "react-map-gl";
import { bbox } from "@turf/turf";

import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.scss";

import REGIONS from "../../geojson/regions";
import COMMUNES from "../../geojson/communes";
import SUB_COMMUNES from "../../geojson/sub_communes";

const INITIAL_VIEWSTATE = {
  width: 1690,
  height: 1268,
  latitude: 7.162681268559845,
  longitude: -5.316224735005939,
  zoom: 6.177819528655691,
  altitude: 1.5,
  maxZoom: 20,
  minZoom: 0,
  maxPitch: 60,
  minPitch: 0
};

const ZONES = [
  ...REGIONS.features,
  ...COMMUNES.features,
  ...SUB_COMMUNES.features
];

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: INITIAL_VIEWSTATE
    };

    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._flyTo = this._flyTo.bind(this);
  }

  _onViewStateChange({ viewState }) {
    this.setState({ viewState });
  }

  _flyTo(data) {
    const { viewState, hoveredObject } = this.state;
    const viewport = new WebMercatorViewport(viewState);

    const coords = [
      [data[0], data[1]],
      [data[2], data[3]]
    ];

    const { longitude, latitude, zoom } = viewport.fitBounds(coords, {
      padding: 20
    });

    this.setState({
      viewState: {
        ...viewState,
        longitude,
        latitude,
        zoom,
        pitch: 0,
        transitionDuration: "auto",
        transitionInterpolator: new FlyToInterpolator({
          curve: 2,
          speed: 0.8
        })
      }
    });
  }

  _renderLayers() {
    const { data, points, layer } = this.props;
    const { hoveredObject } = this.state;

    const activeIds = data.active ? data.active.map(item => item.id) : [];

    const borderStyle = {
      stroked: true,
      filled: true,
      opacity: 1,
      lineWidthMinPixels: 2,
      getLineColor: item => {
        return [30, 75, 96];
      },
      getFillColor: item => {
        return [255, 255, 255, 0.8];
      },
      pickable: true,
      visible: true,
      onHover: info => {
        this.setState({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y
        });
      },
      parameters: {
        depthTest: true
      },
      updateTriggers: {
        getLineColor: activeIds,
        getFillColor: hoveredObject
      }
    };

    const regions = [
      new GeoJsonLayer({
        id: "regions-layer",
        data: REGIONS,
        ...borderStyle
      }),
      new GeoJsonLayer({
        id: "regions-active-layer",
        data: {
          type: "FeatureCollection",
          features: REGIONS.features.filter(item => activeIds.includes(item.id))
        },
        ...borderStyle,
        getLineColor: [31, 122, 113]
      })
    ];

    const communes = [
      new GeoJsonLayer({
        id: "communes-layer",
        data: COMMUNES,
        ...borderStyle
      }),
      new GeoJsonLayer({
        id: "communes-active-layer",
        data: {
          type: "FeatureCollection",
          features: COMMUNES.features.filter(item =>
            activeIds.includes(item.id)
          )
        },
        ...borderStyle,
        getLineColor: [31, 122, 113]
      })
    ];

    const sub_communes = [
      new GeoJsonLayer({
        id: "sub_communes-layer",
        data: SUB_COMMUNES,
        ...borderStyle
      }),
      new GeoJsonLayer({
        id: "communes-active-layer",
        data: {
          type: "FeatureCollection",
          features: SUB_COMMUNES.features.filter(item =>
            activeIds.includes(item.id)
          )
        },
        ...borderStyle,
        getLineColor: [31, 122, 113]
      })
    ];

    const poi = [
      new ScatterplotLayer({
        id: "poi-layer",
        data: points,
        filled: true,
        getPosition: d => [Number(d.x), Number(d.y)],
        getFillColor: item => (layer.id ? item.typecolor : item.groupcolor),
        getRadius: 30,
        radiusMinPixels: 1,
        pickable: true,
        onHover: info => {
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          });
        },
        updateTriggers: {
          getFillColor: layer.id
        }
      })
    ];

    return [
      data.id === "regions" ? regions : null,
      data.id === "communes" ? communes : null,
      data.id === "sub_communes" ? sub_communes : null,
      points ? poi : null
    ];
  }

  _renderTooltip() {
    const { hoveredObject, pointerX, pointerY } = this.state || {};
    return (
      hoveredObject && (
        <div
          className={"map-tooltip"}
          style={{
            position: "absolute",
            zIndex: 10,
            pointerEvents: "none",
            left: pointerX,
            top: pointerY
          }}
        >
          {hoveredObject.name || hoveredObject.properties.label}
        </div>
      )
    );
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;

    if (data !== prevProps.data) {
      if (data.active && data.active.length) {
        const zones = data.active.map(location => {
          const match = ZONES.find(
            item => item.id.toString() === location.id.toString()
          );
          location.geojson = match;
          location.bounds = bbox(match);
          return location;
        });
        const bounds = bbox({
          type: "FeatureCollection",
          features: zones.map(item => item.geojson)
        });
        if (bounds) {
          return this._flyTo(bounds);
        }
      } else if (data && data.items) {
        const zones = data.items.map(location => {
          const match = ZONES.find(
            item => item.id.toString() === location.id.toString()
          );

          location.geojson = match;
          location.bounds = bbox(match);
          return location;
        });

        const bounds = bbox({
          type: "FeatureCollection",
          features: zones.map(item => item.geojson)
        });

        if (bounds) {
          return this._flyTo(bounds);
        }
      }
    }
  }

  render() {
    const { viewState } = this.state;

    return (
      <div className="Map">
        <div>
          <DeckGL
            viewState={viewState}
            controller={{ type: MapController, doubleClickZoom: false }}
            onViewStateChange={this._onViewStateChange}
            layers={this._renderLayers()}
          >
            <StaticMap
              id="map"
              reuseMaps
              mapStyle="mapbox://styles/brendan-transitlabs/ck7cnn3es0mri1ipaybyanphk"
              preventStyleDiffing={true}
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            />
          </DeckGL>
        </div>
        <div style={{ position: "absolute", zIndex: 20 }}>
          {this._renderTooltip()}
        </div>
      </div>
    );
  }
}

export default Map;
