import React from 'react';
import MDSearchBar from 'react-native-material-design-searchbar';

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
  <MDSearchBar
    inputProps={{
      defaultValue: text,
    }}
    textStyle={textColor ? { color: textColor } : null}
    inputStyle={{
      borderWidth: 0,
      borderRadius: 5,
      marginHorizontal: 5,
      backgroundColor: textFieldBackgroundColor,
    }}
    alwaysShowBackButton={showsCancelButton}
    placeholder={placeholder}
    onFocus={() => onFocus()}
    onClose={() => onCancelButtonPress()}
    onBackPress={() => onCancelButtonPress()}
    onSubmitEditing={() => onSearchButtonPress()}
    onSearchChange={query => onChangeText(query)}
    height={40}
    autoCorrect={false}
    returnKeyType="search"
  />;

SearchBar.defaultProps = {
  text: '',
  textColor: undefined,
  textFieldBackgroundColor: undefined,
  showsCancelButton: false,
  placeholder: '',
};
