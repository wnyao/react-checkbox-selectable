import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Tooltip } from 'reactstrap';
import { HeaderPanel, SourceList, DestinationList } from '../Components';

export default class CheckboxSelectableV2 extends Component {
  _isMounted = true;

  static propTypes = {
    items: PropTypes.array.isRequired,
    selectedItems: PropTypes.array.isRequired,
    height: PropTypes.number, // default to 300
    groupName: PropTypes.string, //is required when two or more multi select are applied
    onChange: PropTypes.func.isRequired,
    customButton: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.func,
    ]).isRequired,
  };

  state = {
    originalItems: [],
    selectedItems: [],
    loading: false,
    searchValue: '',
    selectedCount: 0,
  };

  componentDidMount() {
    const { items, selectedItems } = this.props;
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
    const itemsSelected = selectedItems.filter(item => item.id !== id);
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
    this.setState(
      {
        searchValue: e.target.value,
      },
      this.onSearchButtonClicked
    );
  };

  onSearchButtonClicked = () => {
    const { searchValue, originalItems } = this.state;
    const { items } = this.props;

    if (searchValue.length === 0) {
      this.setState({
        originalItems: items,
      });
      return;
    }

    const foundItems = items.filter(item => {
      const hasFound = item.label
        .toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      return hasFound && item;
    });

    this.setState({
      originalItems: foundItems,
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
    const { items, onChange } = this.props;
    const originalItems = this.setCheckedOnOriginalItems(items, []);

    onChange([]);
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
          customButton={customButton}
        />
        {/* Body */}
        <Row xs="12" className="m-0">
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
        </Row>
      </div>
    );
  }
}

export class TooltipComponent extends Component {
  state = {
    isTooltipOpen: false,
  };

  static defaultProps = {
    id: 0,
    label: 'Label not found',
    children: null,
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
