import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  FormGroup,
  InputGroup,
  CustomInput,
  Input,
  Row,
  Col,
  Button,
  Tooltip,
} from 'reactstrap';
import Truncate from 'react-truncate';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// TEST
import { HeaderPanel, SourceList, DestinationList } from '../Components';

export default class CheckboxSelectableV2 extends Component {
  _isMounted = true;

  static propTypes = {
    items: PropTypes.array.isRequired,
    selectedItems: PropTypes.array.isRequired,
    height: PropTypes.number, // default to 300
    groupName: PropTypes.string, //is required when two or more multi select are applied
    onChange: PropTypes.func.isRequired,
    customButton: PropTypes.element,
  };

  state = {
    selectedCount: 0,
    searchValue: '',
    originalItems: [],
    selectedItems: [],
    loading: false,
  };

  componentDidMount() {
    let { items, selectedItems } = this.props;
    const originalItems = this.setCheckedOnOriginalItems(items, selectedItems);
    if (this._isMounted)
      this.setState({
        originalItems,
        selectedItems,
        selectedCount: selectedItems.length,
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) this.componentDidMount();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // UTIL
  setCheckedOnOriginalItems = (originalItems, selectedItems) => {
    // SET ITEMS CHECKED PROPERTY BASED ON GIVEN SELECTEDITEMS
    const newItems = originalItems.map(item => {
      item.checked = selectedItems.find(selected => selected.id === item.id)
        ? true
        : false;
      return item;
    });
    return newItems;
  };

  setItemSelected = itemsSelected => {
    const { originalItems } = this.state;
    this.setCheckedOnOriginalItems(originalItems, itemsSelected);
    // Clear checked prop and send back via onChange
    itemsSelected = this.clearChecked(itemsSelected);
    this.props.onChange(itemsSelected);
    // Set state
    this.setState({
      selectedItems: itemsSelected,
      selectedCount: itemsSelected.length,
    });
  };

  clearChecked = itemsList => {
    return itemsList.map(item => {
      const { id, label } = item;
      const labelString =
        typeof label === 'object'
          ? label.props.dangerouslySetInnerHTML.__html
          : label;
      return {
        id,
        label: labelString,
      };
    });
  };

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  move = (
    sourceList,
    destinationList,
    droppableSource,
    droppabledDestination
  ) => {
    let sourceClone = Array.from(sourceList);
    let desClone = Array.from(destinationList);

    // Move item, remove from source, and add to destination
    const [removed] = Array.from(sourceClone).splice(droppableSource.index, 1);

    if (!desClone.find(item => item.id === removed.id))
      desClone.splice(droppabledDestination.index, 0, removed);

    // Set state
    let state = {};
    state[droppableSource.droppableId] = sourceClone;
    state[droppabledDestination.droppableId] = desClone;
    return state;
  };

  // EVENT HANDLER
  removeItemsHandler = id => {
    const { selectedItems } = this.state;
    const itemsSelected = selectedItems
      .map(item => (item.id !== id ? item : undefined))
      .filter(x => x);
    this.setItemSelected(itemsSelected);
  };

  handleCheckboxChange = (e, id) => {
    const { checked } = e.target;
    const itemsSelected = checked
      ? this.addSelectedItem(id)
      : this.removeSelectedItem(id);
    this.setItemSelected(itemsSelected);
  };

  addSelectedItem = id => {
    let { originalItems, selectedItems } = this.state;
    const item = originalItems.find(item => item.id === id);
    selectedItems.push({
      id: item.id,
      label: item.label,
    });
    return selectedItems;
  };

  removeSelectedItem = id => {
    const { selectedItems } = this.state;
    const itemsSelected = selectedItems
      .map(item => (item.id !== id ? item : null))
      .filter(x => x);
    return itemsSelected;
  };

  onSearchInputChange = e => {
    const { value } = e.target;
    this.setState({
      searchValue: value,
    });
    // Set back to original items list
    if (value.length === 0) {
      const { items } = this.props;
      this.setState({
        originalItems: items,
      });
    }
  };

  onSearchButtonClicked = () => {
    const { searchValue, originalItems } = this.state;
    let returnItems;
    if (searchValue.length === 0) {
      returnItems = originalItems;
    } else {
      // Search result
      returnItems = originalItems
        .map(item => {
          const { label } = item;
          return (
            label
              .toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase()) && item
          );
        })
        .filter(x => x);
    }
    this.setState({
      originalItems: returnItems,
    });
  };

  onSelectAllClicked = () => {
    const { originalItems } = this.state;
    const selectedItems = this.setCheckedOnOriginalItems(
      originalItems,
      originalItems
    );
    this.setItemSelected(selectedItems);
  };

  onClearClicked = () => {
    const { items } = this.props;
    const originalItems = this.setCheckedOnOriginalItems(items, []);
    this.props.onChange([]);
    this.setState({
      originalItems,
      selectedItems: [],
      selectedCount: 0,
    });
  };

  onDragEnd = event => {
    const { source, destination } = event;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      // Reorder on single list
      const items = this.reorder(
        this.state[source.droppableId],
        source.index,
        destination.index
      );

      //TODO: onChange return item list

      // Set state
      let state = {};
      state[source.droppableId] = items;
      this.setState(state);
      return;
    }
    // Move from source to destination list
    const result = this.move(
      this.state[source.droppableId],
      this.state[destination.droppableId],
      source,
      destination
    );

    //TODO: onChange return item list

    // Set state
    let newState = {};
    newState[source.droppableId] = result[source.droppableId];
    newState[destination.droppableId] = result[destination.droppableId];
    newState.originalItems = this.setCheckedOnOriginalItems(
      newState.originalItems,
      newState.selectedItems
    );
    this.setState(newState);
  };

  render() {
    const { height = 300, groupName, truncateText, customButton } = this.props;
    const {
      originalItems,
      selectedItems,
      selectedCount,
      searchValue,
    } = this.state;
    return (
      <div className="border">
        {/* Header */}
        <HeaderPanel
          searchValue={searchValue}
          selectedCount={selectedCount}
          onClearClicked={this.onClearClicked}
          onSelectAllClicked={this.onSelectAllClicked}
          onSearchInputChange={this.onSearchInputChange}
          onSearchButtonClicked={this.onSearchButtonClicked}
          customButton={customButton}
        />
        {/* Body */}
        <Row xs="12" className="m-0">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <ListWrapper height={height}>
              <SourceList
                items={originalItems}
                height={height}
                onChange={this.handleCheckboxChange}
                onDragEnd={this.onDragEnd}
                groupName={groupName}
                truncateText={truncateText}
              />
            </ListWrapper>
            <ListWrapper height={height}>
              <DestinationList
                items={selectedItems}
                height={height}
                onDragEnd={this.onDragEnd}
                removeItemsHandler={this.removeItemsHandler}
                truncateText={truncateText}
              />
            </ListWrapper>
          </DragDropContext>
        </Row>
      </div>
    );
  }
}

export class TooltipComponent extends Component {
  static defaultProps = {
    id: 0,
    label: 'Label not found',
    children: null,
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

const ListWrapper = ({ height, children }) => (
  <Col
    xs="12"
    sm="6"
    className="border p-0"
    style={{
      minHeight: `${height}px`,
    }}
  >
    {children}
  </Col>
);
