/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
import * as React from 'react';

export const initSort = { current: { num: 0, asc: true }, styles: [''] };
export interface Sort {
  current: {
    num: number;
    asc: boolean;
  };
  styles: string[];
}
interface Props {
  setSort: (sort: Sort) => void;
}

export const SortSelect: React.FC<Props> = (props) => {
  const [sort, setSort] = React.useState({ ...initSort, styles: ['bg-green-300'] });


  const sortClick = (but: number) => {
    const newSort = { ...initSort, current: { asc: true, num: but }, styles: [...initSort.styles] };
    newSort.styles[but] = 'bg-green-300';

    setSort(newSort);
    // eslint-disable-next-line react/prop-types
    props.setSort(newSort);
    // setData({ data: data.data.Countries.sort(() => { compare() }) });
  };

  return (
    <div className="">
      <h2 className="text-xl sm:inline-block mr-2">Sort by</h2>
      <button
        className={'p-2 border rounded border-gray-500 my-2 mr-1 ' + sort.styles[0]}
        type="button"
        onClick={() => { sortClick(0); }}
      >
        Name
      </button>
      <button
        className={'p-2 border rounded border-gray-500 my-2 mr-1 ' + sort.styles[1]}
        type="button"
        onClick={() => { sortClick(1); }}
      >
        Total confirmed
      </button>
      <button
        className={'p-2 border rounded border-gray-500 my-2 mr-1 ' + sort.styles[2]}
        type="button"
        onClick={() => { sortClick(2); }}
      >
        Total Deaths
      </button>
      <button
        className={'p-2 border rounded border-gray-500 my-2 mr-1 ' + sort.styles[3]}
        type="button"
        onClick={() => { sortClick(3); }}
      >
        Total Recovered
      </button>
    </div>
  );
};
