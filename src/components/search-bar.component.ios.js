import React from 'react';
import RNSearchBar from 'react-native-search-bar';

type Props = {
  text?: string,
  textColor?: string,
  textFieldBackgroundColor?: string,
  showsCancelButton?: boolean,
  placeholder?: string,
  onFocus: Function,
  onCancelButtonPress: Function,
  onSearchButtonPress: Function,
  onChangeText: Function,
};

export const SearchBar = ({
  text,
  textColor,
  textFieldBackgroundColor,
  showsCancelButton,
  placeholder,
  onFocus,
  onCancelButtonPress,
  onSearchButtonPress,
  onChangeText,
}: Props) =>
  <RNSearchBar
    ref={ref => {
      this.searchBar = ref;
    }}
    text={text}
    textColor={textColor}
    textFieldBackgroundColor={textFieldBackgroundColor}
    showsCancelButton={showsCancelButton}
    placeholder={placeholder}
    onFocus={onFocus}
    onCancelButtonPress={() => {
      if (typeof onCancelButtonPress === 'function') {
        onCancelButtonPress();
      }
      this.searchBar.unFocus();
    }}
    onSearchButtonPress={() => {
      if (typeof onSearchButtonPress === 'function') {
        onSearchButtonPress();
      }
      this.searchBar.unFocus();
    }}
    onChangeText={onChangeText}
    hideBackground
  />;

SearchBar.defaultProps = {
  text: '',
  textColor: '',
  textFieldBackgroundColor: '',
  showsCancelButton: false,
  placeholder: '',
};
