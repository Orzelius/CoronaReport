/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
import * as React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { SortSelect, initSort, Sort } from './SortSelect';

export interface Global {
  NewConfirmed: number;
  TotalConfirmed: number;
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
}

export interface Country {
  Country: string;
  CountryCode: string;
  Slug: string;
  NewConfirmed: number;
  TotalConfirmed: number;
  NewDeaths: number;
  TotalDeaths: number;
  NewRecovered: number;
  TotalRecovered: number;
  Date: Date;
}

export interface RootObject {
  Global: Global;
  Countries: Country[];
  Date: Date;
}

const Stats: React.FC = () => {
  let initStateData: RootObject;
  let worldCountry: Country;
  const history = useHistory();
  const [data, setData] = React.useState({ data: initStateData, loadSuccess: 3 });
  const [showWord, setShowWorld] = React.useState(true);

  if (!data.data) {
    axios.get('https://api.covid19api.com/summary').then((res) => {
      setData({ data: res.data, loadSuccess: 1 });
      // console.log(data.Countries[0]);
    })
      .catch((e) => {
        console.log(e);
        setData({ data: null, loadSuccess: 0 });
      });
  }
  const sortChanged = (newSort: Sort) => {
    console.log('sort changed', newSort);
    const sortedData = [...data.data.Countries];
    switch (newSort.current.num) {
      case (0):
        sortedData.sort((a, b) => a.Country.localeCompare(b.Country));
        break;
      case (1):
        // eslint-disable-next-line no-nested-ternary
        sortedData.sort((a, b) => (a.TotalConfirmed < b.TotalConfirmed ? -1 : a.TotalConfirmed > b.TotalConfirmed ? 1 : 0));
        break;
      case (2):
        // eslint-disable-next-line no-nested-ternary
        sortedData.sort((a, b) => (a.TotalDeaths < b.TotalDeaths ? -1 : a.TotalDeaths > b.TotalDeaths ? 1 : 0));
        break;
      case (3):
        // eslint-disable-next-line no-nested-ternary
        sortedData.sort((a, b) => (a.TotalRecovered < b.TotalRecovered ? -1 : a.TotalRecovered > b.TotalRecovered ? 1 : 0));
        break;
      default:
        break;
    }

    if (newSort.current.num !== 0) {
      sortedData.reverse();
    }
    const newData = { ...data };
    newData.data.Countries = sortedData;

    setData(newData);
  };

  if (data.data) {
    worldCountry = {
      Slug: 'wrld',
      Country: 'World',
      CountryCode: null,
      Date: null,
      NewConfirmed: data.data.Global.NewConfirmed,
      NewRecovered: data.data.Global.NewRecovered,
      NewDeaths: data.data.Global.NewDeaths,
      TotalConfirmed: data.data.Global.TotalConfirmed,
      TotalDeaths: data.data.Global.TotalDeaths,
      TotalRecovered: data.data.Global.TotalRecovered,
    };
    const countries = [worldCountry, ...data.data.Countries].map((country, i) => (
      <div hidden={i === 0 && !showWord} id={i.toString()} key={Math.random()} className="my-2 sm:w-64 border-b mx-4 sm:inline-block hover:border-blue-600">
        <div
          className="cursor-pointer items-center bg-blue-400 text-white text-sm font-bold px-4 py-3 rounded-tr-lg rounded-tl-lg"
          onClick={() => {
            history.push('/' + country.Slug);
          }}
        >
          <p className="inline-block mr-2">{i}</p>
          <p className="inline-block">{country.Country.slice(0, 20) + (country.Country.length > 20 ? '...' : '')}</p>
          <img className="inline-block h-8 float-right pb-2" alt={country.Country + ' flag'} src={'https://www.countryflags.io/' + country.CountryCode + '/flat/64.png'} />
        </div>
        <ul className="">
          <table className="">
            <tbody>
              <tr>
                <td>Recovered</td>
                <td className=""><b>{country.TotalRecovered}</b></td>
              </tr>
              <tr>
                <td>Deaths</td>
                <td className=""><b>{country.TotalDeaths}</b></td>
              </tr>
              <tr className="">
                <td>Confirmed</td>
                <td className=""><b>{country.TotalConfirmed}</b></td>
              </tr>
              <tr>
                <td>New Recovered</td>
                <td className=""><b>{country.NewRecovered}</b></td>
              </tr>
              <tr>
                <td>New deaths</td>
                <td className=""><b>{country.NewDeaths}</b></td>
              </tr>
              <tr>
                <td>New Confirmed</td>
                <td className=""><b>{country.NewConfirmed}</b></td>
              </tr>
            </tbody>
          </table>
        </ul>
      </div>
    ));
    return (
      <div className="mx-auto">
        <SortSelect setSort={(sort) => { sortChanged(sort); }} />
        <div className="mb-4">
          <input type="checkbox" defaultChecked id="vehicle1" name="vehicle1" value="Bike" className="inline-block mr-2" onChange={() => { setShowWorld(!showWord); }} />
          <p className="inline-block">Show world</p>
        </div>
        <div className="block">
          {...countries}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
        <h1 className="text-xl">{data.loadSuccess === 3 ? 'Loading...' : 'Failed to load data'}</h1>
      </div>
    </div>
  );
};

export default Stats;
