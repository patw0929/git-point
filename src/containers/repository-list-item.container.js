import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSearchRepoSelector } from 'search';
import { RepositoryListItem as Component } from '../components/repository-list-item.component';

const makeSelector = (initialState, initialOwnProps) => {
  const { id } = initialOwnProps;

  const selector = createStructuredSelector({
    repo: makeSearchRepoSelector(id),
  });

  return state => ({
    ...selector(state),
    id,
  });
};

export const RepositoryListItem = connect(makeSelector)(Component);
