import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { ButtonGroup } from 'react-native-elements';

import { RepositoryListItem, UserListItem } from 'containers';
import { ViewContainer, LoadingContainer, SearchBar } from 'components';
import { colors, fonts, normalize } from 'config';

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: colors.white,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? 20 : 5,
  },
  searchContainer: {
    width: Dimensions.get('window').width,
    backgroundColor: colors.white,
    flex: 1,
    height: 55,
    justifyContent: 'center',
  },
  list: {
    marginTop: 0,
  },
  buttonGroupContainer: {
    height: 30,
    ...Platform.select({
      ios: {
        marginTop: 0,
        marginBottom: 10,
      },
      android: {
        marginTop: 5,
        marginBottom: 12,
      },
    }),
  },
  buttonGroupText: {
    ...fonts.fontPrimaryBold,
  },
  buttonGroupTextSelected: {
    color: colors.black,
  },
  loadingIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTitle: {
    fontSize: normalize(18),
    textAlign: 'center',
    ...fonts.fontPrimary,
  },
  searchCancelButton: {
    color: colors.black,
  },
  listContainer: {
    borderTopColor: colors.greyLight,
    borderTopWidth: 1,
    marginBottom: 105,
  },
  noBorderTopWidth: {
    borderTopWidth: 0,
  },
});

export default class Search extends Component {
  props: {
    keyword: string,
    type: number,
    searchReposIfNeeded: Function,
    searchReposMore: Function,
    searchReposReload: Function,
    searchUsersIfNeeded: Function,
    searchUsersMore: Function,
    searchUsersReload: Function,
    reposIdsList: Array,
    usersIdsList: Array,
    reposIsFetching: boolean,
    usersIsFetching: boolean,
    reposIsRefreshing: boolean,
    usersIsRefreshing: boolean,
    reposHasMore: boolean,
    usersHasMore: boolean,
    navigation: Object,
  };

  state: {
    query: string,
    searchType: number,
    searchFocus: boolean,
  };

  constructor(props) {
    super(props);

    this.state = {
      query: '',
      searchType: typeof props.type !== 'undefined' ? props.type : 0,
      searchFocus: false,
    };

    this._reposRefreshControl = [];
    this._usersRefreshControl = [];
  }

  search = (selectedType = null) => {
    const { searchReposIfNeeded, searchUsersIfNeeded, navigation } = this.props;
    const { query, searchType } = this.state;
    const selectedSearchType =
      selectedType !== null ? selectedType : searchType;

    if (query !== '') {
      if (selectedSearchType === 0) {
        searchReposIfNeeded(query);
      } else {
        searchUsersIfNeeded(query);
      }

      navigation.dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Search',
              key: `Search_${selectedSearchType}_${query}`,
              params: { query, type: selectedSearchType },
            }),
          ],
        })
      );
    }
  };

  switchQueryType = selectedType => {
    this.setState(
      {
        searchType: selectedType,
        query: this.props.keyword || '',
      },
      () => {
        this.search(selectedType);
      }
    );
  };

  handleRefresh = () => {
    const { keyword } = this.props;
    const { searchType } = this.state;

    if (searchType === 0) {
      this.props.searchReposReload(keyword);
    } else {
      this.props.searchUsersReload(keyword);
    }
  };

  handleEndReached = () => {
    const {
      keyword,
      reposHasMore,
      searchReposMore,
      usersHasMore,
      searchUsersMore,
    } = this.props;
    const { searchType } = this.state;

    if (searchType === 0 && reposHasMore) {
      searchReposMore(keyword);
    } else if (searchType === 1 && usersHasMore) {
      searchUsersMore(keyword);
    }
  };

  keyExtractor = item => {
    return item;
  };

  renderItem = ({ item }) => {
    if (this.state.searchType === 0) {
      return (
        <RepositoryListItem
          key={item}
          id={item}
          navigation={this.props.navigation}
        />
      );
    }

    return (
      <UserListItem key={item} id={item} navigation={this.props.navigation} />
    );
  };

  renderWithViewContainer = content => {
    return (
      <View style={styles.viewContainer}>
        <View>
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchContainer}>
              <SearchBar
                text={this.props.keyword}
                textColor={colors.primaryDark}
                textFieldBackgroundColor={colors.greyLight}
                showsCancelButton={this.state.searchFocus}
                onFocus={() => this.setState({ searchFocus: true })}
                onCancelButtonPress={() => this.setState({ query: '' })}
                onSearchButtonPress={this.search}
                onChangeText={text => {
                  this.setState({ query: text });
                }}
                hideBackground
              />
            </View>
          </View>

          <ButtonGroup
            onPress={this.switchQueryType}
            selectedIndex={this.state.searchType}
            buttons={['Repositories', 'Users']}
            textStyle={styles.buttonGroupText}
            selectedTextStyle={styles.buttonGroupTextSelected}
            containerStyle={styles.buttonGroupContainer}
          />
        </View>

        {content}
      </View>
    );
  };

  render() {
    const {
      keyword,
      reposIdsList,
      usersIdsList,
      reposIsFetching,
      usersIsFetching,
      reposIsRefreshing,
      usersIsRefreshing,
    } = this.props;
    const { searchType } = this.state;
    const reposIdsAmounth = (reposIdsList && reposIdsList.length) || 0;
    const usersIdsAmounth = (usersIdsList && usersIdsList.length) || 0;
    const noResult = reposIdsAmounth + usersIdsAmounth === 0;

    if (reposIsFetching && searchType === 0 && reposIdsAmounth === 0) {
      return this.renderWithViewContainer(
        <LoadingContainer
          animating={reposIsFetching && searchType === 0}
          text={`Searching for ${keyword}`}
          style={styles.marginSpacing}
        />
      );
    }

    if (usersIsFetching && searchType === 1 && usersIdsAmounth === 0) {
      return this.renderWithViewContainer(
        <LoadingContainer
          animating={usersIsFetching && searchType === 1}
          text={`Searching for ${keyword}`}
          style={styles.marginSpacing}
        />
      );
    }

    if (reposIsFetching && usersIsFetching) {
      return this.renderWithViewContainer(
        <View style={styles.textContainer}>
          <Text style={styles.searchTitle}>
            {`Search for any ${searchType === 0 ? 'repository' : 'user'}`}
          </Text>
        </View>
      );
    }

    if (
      reposIsFetching === false &&
      reposIdsAmounth === 0 &&
      searchType === 0
    ) {
      return this.renderWithViewContainer(
        <View style={styles.textContainer}>
          <Text style={styles.searchTitle}>No repositories found :(</Text>
        </View>
      );
    }

    if (
      usersIsFetching === false &&
      usersIdsAmounth === 0 &&
      searchType === 1
    ) {
      return this.renderWithViewContainer(
        <View style={styles.textContainer}>
          <Text style={styles.searchTitle}>No users found :(</Text>
        </View>
      );
    }

    if (!this._reposRefreshControl[reposIsRefreshing]) {
      this._reposRefreshControl[reposIsRefreshing] = (
        <RefreshControl
          refreshing={reposIsRefreshing}
          onRefresh={this.handleRefresh}
          title=""
        />
      );
    }

    if (!this._usersRefreshControl[usersIsRefreshing]) {
      this._usersRefreshControl[usersIsRefreshing] = (
        <RefreshControl
          refreshing={usersIsRefreshing}
          onRefresh={this.handleRefresh}
          title=""
        />
      );
    }

    if (!noResult) {
      return this.renderWithViewContainer(
        <View style={styles.listContainer}>
          <FlatList
            data={searchType === 0 ? reposIdsList : usersIdsList}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            onEndReached={this.handleEndReached}
            refreshControl={
              searchType === 0
                ? this._reposRefreshControl[reposIsRefreshing]
                : this._usersRefreshControl[usersIsRefreshing]
            }
          />
        </View>
      );
    }

    return (
      <ViewContainer>
        {noResult &&
          this.renderWithViewContainer(
            <View style={styles.textContainer}>
              <Text style={styles.searchTitle}>
                {`Search for any ${searchType === 0 ? 'repository' : 'user'}`}
              </Text>
            </View>
          )}
      </ViewContainer>
    );
  }
}
