import React from 'react';
import { Input, Row, Col, Button } from 'reactstrap';

let ButtonComponent = Button;

const HeaderPanel = props => {
  const { customButton } = props;
  ButtonComponent = customButton || Button;

  return (
    <Row xs="12" className="m-0">
      <Col xs="6" className="border py-4">
        <SourceHeader {...props} />
      </Col>
      <Col xs="6" className="border py-4">
        <DestinationHeader {...props} />
      </Col>
    </Row>
  );
};

const SourceHeader = props => {
  const { onSearchButtonClicked, onSelectAllClicked } = props;

  return (
    <Row>
      <Col xs="12" lg="7" className="">
        <Input
          type="text"
          placeholder="Search"
          className="border-0 my-1"
          style={{ zIndex: 0 }}
          onChange={e => onSearchButtonClicked(e.target.value)}
        />
      </Col>
      <Col
        xs="12"
        lg="5"
        className="justify-content-end d-flex align-items-center pl-0"
      >
        <ButtonComponent
          className="primary-btn-style"
          onClick={onSelectAllClicked}
        >
          Select All
        </ButtonComponent>
      </Col>
    </Row>
  );
};

const DestinationHeader = props => {
  const { selectedCount, onClearClicked } = props;

  return (
    <Row>
      <Col xs="6" className="d-flex align-items-center">
        <Input
          disabled
          type="text"
          placeholder="Search"
          className="border-0 my-1 pl-0"
          style={{ zIndex: 0, background: 'white' }}
          value={selectedCount + ' selected'}
        />
      </Col>
      <Col xs="6" className="justify-content-end d-flex align-items-center">
        <ButtonComponent className="primary-btn-style" onClick={onClearClicked}>
          Clear
        </ButtonComponent>
      </Col>
    </Row>
  );
};

export default HeaderPanel;
