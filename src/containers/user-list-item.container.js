import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSearchUserSelector } from 'search';
import { UserListItem as Component } from '../components/user-list-item.component';

const makeSelector = (initialState, initialOwnProps) => {
  const { id } = initialOwnProps;

  const selector = createStructuredSelector({
    user: makeSearchUserSelector(id),
  });

  return state => ({
    ...selector(state),
    id,
  });
};

export const UserListItem = connect(makeSelector)(Component);
