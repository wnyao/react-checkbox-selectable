import React from 'react';

import Truncate from 'react-truncate';
import { Row, Col, Button } from 'reactstrap';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const DestinationList = ({
  items,
  removeItemsHandler,
  height = 300,
  truncateText,
}) => {
  const RowRenderer = ({ index }) => {
    const { id, label } = items[index];
    return (
      <Draggable draggableId={id} index={index} key={id}>
        {(provided, snapshot) => {
          const { innerRef, dragHandleProps, draggableProps } = provided;
          return (
            <div ref={innerRef} {...draggableProps} {...dragHandleProps}>
              <Row xs="12" className="pr-2 pl-2 pt-1 m-0">
                <Col xs="11">
                  <div style={{ width: '100%' }}>
                    {truncateText ? (
                      <Truncate lines={1} children={label} ellipsis="…" />
                    ) : (
                      <p>{label}</p>
                    )}
                  </div>
                </Col>
                <Col xs="1">
                  <Button
                    close
                    className="float-right"
                    onClick={() => removeItemsHandler(id)}
                  />
                </Col>
              </Row>
            </div>
          );
        }}
      </Draggable>
    );
  };
  return (
    <Droppable droppableId="selectedItems">
      {(provided, snapshot) => {
        const { innerRef } = provided;
        return (
          <div
            ref={innerRef}
            style={{ height, overflow: 'auto', flex: 'unset' }}
          >
            {items.map((item, index) => (
              <RowRenderer key={index} index={index} />
            ))}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

export default DestinationList;
