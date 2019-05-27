import React, { Component } from 'react';

import { Button } from 'reactstrap';
import CheckboxSelectable from './CheckboxSelectable';

import { getDataArray } from './Utilities/util'; // Mock data

export default class SideBySideExamples extends Component {
  _isMounted = true;
  state = {
    data: [],
  };
  componentDidMount() {
    const data = getDataArray(20);
    this.setState({ data });
  }
  render() {
    return (
      <div>
        <h5 className="text-bold pt-4">CheckboxSelectable</h5>
        <CheckboxSelectable
          name="text"
          items={this.state.data}
          selectedItems={[]}
          onChange={selectedItems => {}}
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
