import React, { Component, useEffect, useState } from 'react';

import { Button } from 'reactstrap';
import CheckboxSelectable from './CheckboxSelectable';

import { getDataArray } from './Utilities/util'; // Mock data

export default class SideBySideExamples extends Component {
  state = {
    data: [],
    selected: [],
  };

  componentDidMount() {
    const data = getDataArray(4000);
    this.setState({ data });
  }

  render() {
    const { selected, data } = this.state;

    return (
      <div>
        <h5 className="text-bold pt-4">CheckboxSelectable</h5>
        <CheckboxSelectable
          name="text"
          items={data}
          selectedItems={selected}
          onChange={selected => this.setState({ selected })}
          customButton={CustomButton}
        />
      </div>
    );
  }
}

function CustomButton(props) {
  return <Button color="info" onClick={() => {}} {...props} />;
}

/**
 * customMultiSelect
 *
 * --------------------------------------
 * AVAILABLE PROPS
 * --------------------------------------
 * items
 * selectedItems
 * groupName
 * onChange (need implementation)
 * tooltipEnabled (need implementation)
 * customButton
 *
 * ---------------------------------------
 * IN CONSIDERATION
 * ---------------------------------------
 * customComponentSource
 * customComponentDestination
 *
 * getOptionId
 * getOptioValue
 *
 */
