import deepEqual from 'deep-equal';
import without from 'lodash.without';
import { SEARCH_REPOS } from './search.type';

/*
 * Example:
 *   filterFromHeadAndConcat([1, 2, 3], [1, 2, 3, 4, 5, 6]);
 *   return [1, 2, 3, 4, 5, 6];
 *   filterFromHeadAndConcat([1, 2, 3, 4, 5, 6], [1, 2, 3]);
 *   return [1, 2, 3, 4, 5, 6];
 */
function filterFromHeadAndConcat(itemsA, itemsB) {
  const [longArray, shortArray] =
    itemsA.length > itemsB.length ? [itemsA, itemsB] : [itemsB, itemsA];

  const diff = without(shortArray, ...longArray.slice(0, shortArray.length));

  return diff && diff.length > 0 ? diff.concat(longArray) : longArray;
}

function filterFromTail(newItems, oldItems) {
  return without(newItems, ...oldItems.slice(-newItems.length));
}

const END = 'end';
const EMPTY_ARRAY = [];
const initialById = {};
const initialList = {};

const initialByIdOne = {
  isFetching: false,
  didInvalidate: false,
  items: null,
};

const initialListOne = {
  isFetching: false,
  didInvalidate: false,
  items: null,
};

function processByIdOne(state = initialByIdOne, actionType, actionResult) {
  switch (actionType) {
    case SEARCH_REPOS.SUCCESS: {
      const item = {
        ...state.items,
        ...actionResult,
      };
      const newItem = deepEqual(state.items, item) ? state.items : item;

      return {
        ...state,
        isFetching: false,
        items: newItem,
      };
    }
    default: {
      return state;
    }
  }
}

// handle a list of items
function processByIdReduce(state, action, data, result) {
  return (data || EMPTY_ARRAY).reduce((collection, item) => {
    const id = item.id;

    collection[id] = processByIdOne(state[id], action.type, item); // eslint-disable-line no-param-reassign

    return collection;
  }, result);
}

function processById(state = initialById, action) {
  switch (action.type) {
    case SEARCH_REPOS.SUCCESS: {
      const items = action.result.items;
      let newState = {};

      newState = processByIdReduce(state, action, items, newState);

      return {
        ...state,
        ...newState,
      };
    }
    default: {
      return state;
    }
  }
}

function processListOne(state = initialListOne, action) {
  switch (action.type) {
    case SEARCH_REPOS.PENDING: {
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
      };
    }
    case SEARCH_REPOS.ERROR: {
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        error: action.error,
      };
    }
    case SEARCH_REPOS.SUCCESS: {
      const { result, meta } = action;
      const items = result.items;
      const dataIds =
        (items && items.map && items.map(d => d.id)) || EMPTY_ARRAY;
      const currentPage = meta.currentPage || 1;
      let newItems =
        (state.didInvalidate ? EMPTY_ARRAY : state.items) || EMPTY_ARRAY;

      if (currentPage === 1) {
        // filter and prepend
        newItems = filterFromHeadAndConcat(dataIds, newItems);

        // remain old currentPage and nextPageUrl or use new data
        meta.currentPage =
          (state.meta && state.meta.currentPage) || meta.currentPage;
        meta.nextPageUrl =
          (state.meta && state.meta.nextPageUrl) || meta.nextPageUrl;
      } else {
        const oldCurrentPage = (state.meta && state.meta.currentPage) || 0;

        if (currentPage > oldCurrentPage) {
          // append
          const newData = filterFromTail(dataIds, newItems);

          newItems =
            newData && newData.length > 0 ? newItems.concat(newData) : newItems;
        } else {
          // old pages fetched. do nothing
        }
      }

      if (meta.nextPageUrl === null) {
        meta.nextPageUrl = END;
      }

      return {
        ...state,
        meta,
        items: newItems,
        isFetching: false,
        didInvalidate: false,
        error: null,
      };
    }
    default: {
      return state;
    }
  }
}

function processList(state = initialList, action) {
  switch (action.type) {
    case SEARCH_REPOS.PENDING:
    case SEARCH_REPOS.ERROR:
    case SEARCH_REPOS.SUCCESS: {
      return {
        ...state,
        [action.query]: processListOne(state[action.query], action),
      };
    }
    default: {
      return state;
    }
  }
}

export function searchReposReducer(state = {}, action) {
  return {
    byId: processById(state.byId, action, state),
    list: processList(state.list, action, state),
  };
}
