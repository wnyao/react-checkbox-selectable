import React from 'react';
import { InputGroup, Input, Row, Col, Button } from 'reactstrap';

const HeaderPanel = ({
  onClearClicked,
  onSelectAllClicked,
  onSearchInputChange,
  onSearchButtonClicked,
  selectedCount,
  searchValue,
  customButton,
}) => {
  const ButtonComponent = customButton || Button;
  return (
    <Row xs="12" className="m-0">
      <Col className="border pt-4 pb-4 m-0">
        <InputGroup>
          <Input
            type="text"
            placeholder="Search"
            className="border-0 mr-1"
            style={{ zIndex: 0 }}
            value={searchValue}
            onChange={onSearchInputChange}
          />
          <ButtonComponent
            className="primary-btn-style mr-1 d-flex"
            onClick={onSearchButtonClicked}
          >
            <i className="material-icons align-text-bottom">search</i>
          </ButtonComponent>
          <ButtonComponent
            className="primary-btn-style"
            onClick={onSelectAllClicked}
          >
            Select All
          </ButtonComponent>
        </InputGroup>
      </Col>
      <Col xs="6" className="border pt-4 pb-4 m-0">
        <InputGroup className="d-flex align-items-center">
          <Col className="text-left">{selectedCount} selected</Col>
          <Col className="text-right p-0">
            <ButtonComponent
              className="primary-btn-style"
              onClick={onClearClicked}
            >
              Clear
            </ButtonComponent>
          </Col>
        </InputGroup>
      </Col>
    </Row>
  );
};

export default HeaderPanel;
