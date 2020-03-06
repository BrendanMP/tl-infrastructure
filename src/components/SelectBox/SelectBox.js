import React, { Component } from "react";
import AsyncSelect from "react-select";

import "./SelectBox.scss";

class SelectBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedOption) {
    this.setState({ selectedOption });
    this.props.onChange(selectedOption);
  }

  render() {
    const { options, selected, isMulti, placeholder } = this.props;
    const { selectedOption } = this.state;

    return (
      <div className={`SelectBox ${isMulti ? "SelectBox--multi" : null}`}>
        <AsyncSelect
          classNamePrefix={"SelectBox__input"}
          placeholder={placeholder}
          theme={theme => ({
            ...theme,
            borderRadius: 0
          })}
          value={selected || selectedOption}
          onChange={this.handleChange}
          options={options}
          isMulti={isMulti}
        />
      </div>
    );
  }
}

export default SelectBox;
