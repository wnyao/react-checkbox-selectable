import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'reactstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import { HeaderPanel, SourceList, DestinationList } from 'Components';

export default class CheckboxSelectable extends Component {
  _isMounted = true;

  static propTypes = {
    items: PropTypes.array.isRequired,
    selectedItems: PropTypes.array.isRequired,
    height: PropTypes.number, // default to 300
    groupName: PropTypes.string, //is required when two or more multi select are applied
    onChange: PropTypes.func.isRequired,
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
    const { items, selectedItems } = this.props;
    const evaluation =
      prevProps.items !== items || prevProps.selectedItems !== selectedItems;
    if (evaluation) this.componentDidMount();
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
    const { originalItems } = this.state;
    this.setCheckedOnOriginalItems(originalItems, []);
    this.props.onChange([]);
    this.setState({
      selectedItems: [],
      selectedCount: 0,
    });
  };

  onDragEnd = result => {
    // If drop outsite of droppable
    if (!result.destination) return;
    // Reorder list
    const items = this.reorder(
      this.state.selectedItems,
      result.source.index,
      result.destination.index
    );
    // Set state
    this.props.onChange(items);
    this.setState({
      selectedItems: items,
    });
  };

  render() {
    const { height = 300, name, truncateText } = this.props;
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
        />
        {/* Body */}
        <Row xs="12" className="m-0">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <ListWrapper height={height}>
              <SourceList
                items={originalItems}
                height={height}
                onChange={this.handleCheckboxChange}
                name={name}
                truncateText={truncateText}
              />
            </ListWrapper>
            <ListWrapper height={height}>
              <DestinationList
                items={selectedItems}
                height={height}
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
