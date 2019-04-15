import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'reactstrap';

export default class TooltipComponent extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.element.isRequired,
  };
  state = {
    isTooltipOpen: false,
  };
  onTooltipOpen = e => {
    const { isTooltipOpen } = this.state;
    this.setState({
      isTooltipOpen: e && !isTooltipOpen,
    });
  };
  render = () => {
    const { isTooltipOpen } = this.state;
    const { id, label, children } = this.props;
    return (
      <div>
        {children}
        <Tooltip
          innerClassName="tooltip-wrapper"
          placement="auto"
          boundariesElement={'window'}
          autohide={false}
          target={id}
          isOpen={isTooltipOpen}
          toggle={e => this.onTooltipOpen(e)}
        >
          <div
          // style={{ width: '500px' }}
          >
            {label}
          </div>
        </Tooltip>
      </div>
    );
  };
}
