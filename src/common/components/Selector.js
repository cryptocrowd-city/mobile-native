import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { CommonStyle } from '../../styles/Common';
import Touchable from './Touchable';
import PropTypes from 'prop-types';
import ThemedStyles from '../../styles/ThemedStyles';

export default class Selector extends Component {
  /**
   * Constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      selected: '',
    };
  }

  show = (item) => {
    this.setState({ show: true, selected: item });
  };

  close = () => {
    this.setState({ show: false });
  };

  renderItem = ({ item }) => {
    const theme = ThemedStyles.style;
    const fontColor = this.isSelected(item)
      ? styles.selectedColorFont
      : styles.fontColor;
    return (
      <Touchable
        onPress={() => this.itemSelect(item)}
        style={CommonStyle.margin2x}>
        <Text style={[fontColor, theme.fontXL, theme.centered]}>{this.valueExtractor(item)}</Text>
      </Touchable>
    );
  };

  itemSelect = (item) => {
    this.props.onItemSelect(item);
    this.close();
  };

  isSelected = (item) => {
    return this.state.selected === this.keyExtractor(item);
  };

  setSelected = (item) => {
    this.setState({ selected: this.keyExtractor(item) });
  };

  valueExtractor = (item) => {
    return this.props.valueExtractor(item);
  };

  keyExtractor = (item) => {
    return this.props.keyExtractor(item);
  };

  render() {
    const theme = ThemedStyles.style;
    return (
      <View>
        <Modal isVisible={this.state.show}>
          <View style={[styles.container]}>
            <Text
              style={[styles.fontColor, theme.fontXXL, styles.marginBottom, theme.centered]}>
              {this.props.title}
            </Text>
            <View
              style={[
                theme.flexContainer,
                theme.marginTop3x,
                theme.paddingLeft2x,
                styles.marginBottom,
              ]}>
              <FlatList
                data={this.props.data}
                renderItem={this.renderItem}
                keyExtractor={this.props.keyExtractor}
                extraData={this.state.selected}
              />
            </View>
            <Icon
              raised
              name="md-close"
              type='ionicon'
              color='black'
              size={24}
              containerStyle={styles.iconContainer}
              onPress={this.close}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

Selector.propTypes = {
  data: PropTypes.array.isRequired,
  valueExtractor: PropTypes.func.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onItemSelect: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: 200,
    height: 450,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 50,
    right: 70,
  },
  iconContainer: {
    backgroundColor: 'transparent',
    width: 55,
    height: 55,
    zIndex: 1000,
  },
  fontColor: {
    color: '#fff',
  },
  selectedColorFont: {
    color: '#0085DD',
  },
  marginBottom: {
    marginBottom: 30,
  },
});