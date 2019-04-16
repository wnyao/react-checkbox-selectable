import React from 'react';

import Truncate from 'react-truncate';
import TooltipComponent from './TooltipComponent';
import { FormGroup, CustomInput } from 'reactstrap';

const SourceList = ({
  items,
  onChange,
  height,
  truncateText,
  name = 'group',
}) => {
  const RowRenderer = ({ index }) => {
    const { id, label, checked } = items[index];
    // TOOLTIP COMPONENT USES UNIQUE IDENTIFIER TO DETERMINE WHAT TOOLTIP TO SHOW
    const identifier = name + index;
    return (
      <div className="pr-2 pl-2 pt-1">
        <FormGroup className="pt-1 d-flex">
          <CustomInput
            type="checkbox"
            id={id}
            checked={checked}
            onChange={e => onChange(e, id)}
          />
          <TooltipComponent id={identifier} label={label}>
            <div id={identifier}>
              {truncateText ? (
                <Truncate lines={1} children={id} ellipsis="…" />
              ) : (
                <p>{label}</p>
              )}
            </div>
          </TooltipComponent>
        </FormGroup>
      </div>
    );
  };
  return (
    <div style={{ height, overflow: 'auto' }}>
      {items.map((item, index) => (
        <RowRenderer key={index} index={index} />
      ))}
    </div>
  );
};

export default SourceList;
