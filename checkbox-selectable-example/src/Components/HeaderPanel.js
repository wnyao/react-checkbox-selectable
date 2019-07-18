import React from 'react';
import { InputGroup, Input, Row, Col, Button } from 'reactstrap';

let ButtonComponent = Button;

const HeaderPanel = props => {
  const {
    onClearClicked,
    onSelectAllClicked,
    onSearchInputChange,
    onSearchButtonClicked,
    selectedCount,
    searchValue,
    customButton,
  } = props;

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
  const {
    onSelectAllClicked,
    onSearchInputChange,
    selectedCount,
    searchValue,
  } = props;

  return (
    <Row>
      <Col xs="7" className="pr-0">
        <Input
          type="text"
          placeholder="Search"
          className="border-0 my-1 pl-0"
          style={{ zIndex: 0 }}
          value={searchValue}
          onChange={onSearchInputChange}
        />
      </Col>
      <Col
        xs="5"
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
