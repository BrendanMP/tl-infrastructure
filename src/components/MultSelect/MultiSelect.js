import React, { Component } from "react";

import SelectBox from "../SelectBox/SelectBox";

class MultiSelect extends Component {
  constructor(props) {
    super(props);
    this.selectedChild = this.selectedChild.bind(this);
  }

  selectedChild(item, selected) {
    this.props.onChange({
      ...selected,
      active: item ? [].concat(item) : []
    });
  }

  render() {
    const { options, selected } = this.props;

    if (options) {
      options.map(item => (item.value = item.id));
    }

    return (
      <div className="d-flex">
        <div className="mr-3">
          <SelectBox
            options={options}
            onChange={this.props.onChange}
            placeholder={"Select Level"}
          />
        </div>
        <div className="mr-3">
          {selected && selected.items ? (
            <SelectBox
              isMulti
              selected={selected.active}
              options={selected.items}
              onChange={item => this.selectedChild(item, selected)}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default MultiSelect;
