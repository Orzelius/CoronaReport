/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import useWindowDimensions from './useWindowDimensions';

type TParams = { id: string };

interface CountryInfoAPIRes {
  Country: string;
  CountryCode: string;
  Lat: string;
  Lon: string;
  Cases: number;
  Status: string;
  Date: Date;
}

interface Data {
  Cases: number;
  Status: string;
  Date: Date;
}

interface CountryData {
  Country: string;
  CountryCode: string;
  Lat: string;
  Lon: string;
  Data: {
    Confirmed: Data[];
    Deaths: Data[];
    Recovered: Data[];
  }
}

interface DataModel {
  Deaths: number;
  Recovered: number;
  Confirmed: number;
  Date: Date;
}
const CountryDetails: React.FC<RouteComponentProps<TParams>> = (props) => {
  const { height, width } = useWindowDimensions();
  const country = props.match.params.id;
  let countryData: CountryData = {
    Country: '',
    CountryCode: '',
    Lat: '',
    Lon: '',
    Data: {
      Confirmed: [],
      Deaths: [],
      Recovered: [],
    },
  };
  // -1 = fail; 0 = noData; 1 = loading; 3 = success;
  const [state, setState] = React.useState({ loadingState: { a: 1, b: 1, c: 1 }, data: countryData });
  console.log('got this far!');
  if (state.loadingState.a === 1) {
    axios.get('https://api.covid19api.com/country/' + country + '/status/confirmed').then((res) => {
      const apiRes: CountryInfoAPIRes[] = res.data;
      console.log(res);
      if (apiRes.length !== 0) {
        countryData = {
          Country: apiRes[0].Country,
          Lat: apiRes[0].Lat,
          Lon: apiRes[0].Lon,
          CountryCode: apiRes[0].CountryCode,
          Data: { Confirmed: apiRes.map((timeStamp) => ({ Cases: timeStamp.Cases, Date: timeStamp.Date, Status: timeStamp.Status })), Deaths: null, Recovered: null },
        };
        const newState = { ...state, data: { ...countryData } };
        state.data.Data.Confirmed = countryData.Data.Confirmed;
        state.loadingState.a = 3;
        setState(newState);
      } else {
        setState({ ...state, loadingState: { ...state.loadingState, a: 0 } });
      }
      // console.log(data.Countries[0]);
    })
      .catch((e) => {
        console.log(e);
        setState({ ...state, loadingState: { ...state.loadingState, a: -1 } });
      });
  }

  if (state.loadingState.b === 1 && state.loadingState.a === 3) {
    axios.get('https://api.covid19api.com/country/' + country + '/status/deaths').then((res) => {
      const apiRes: CountryInfoAPIRes[] = res.data;
      console.log(res);
      if (apiRes.length !== 0) {
        countryData.Data.Deaths = apiRes.map((timeStamp) => ({ Cases: timeStamp.Cases, Date: timeStamp.Date, Status: timeStamp.Status }));
        const newState = { ...state };
        state.data.Data.Deaths = countryData.Data.Deaths;
        state.loadingState.b = 3;
        setState(newState);
      } else {
        setState({ ...state, loadingState: { ...state.loadingState, b: 0 } });
      }
      // console.log(data.Countries[0]);
    })
      .catch((e) => {
        console.log(e);
        setState({ ...state, loadingState: { ...state.loadingState, b: -1 } });
      });
  }
  if (state.loadingState.b === 1 && state.loadingState.a === 3) {
    axios.get('https://api.covid19api.com/country/' + country + '/status/recovered').then((res) => {
      const apiRes: CountryInfoAPIRes[] = res.data;
      console.log(res);
      if (apiRes.length !== 0) {
        countryData.Data.Recovered = apiRes.map((timeStamp) => ({ Cases: timeStamp.Cases, Date: timeStamp.Date, Status: timeStamp.Status }));
        const newState = { ...state };
        state.data.Data.Recovered = countryData.Data.Recovered;
        state.loadingState.c = 3;
        setState(newState);
      } else {
        setState({ ...state, loadingState: { ...state.loadingState, c: 0 } });
      }
      // console.log(data.Countries[0]);
    })
      .catch((e) => {
        console.log(e);
        setState({ ...state, loadingState: { ...state.loadingState, c: -1 } });
      });
  }

  console.log('STATE', state);

  if (state.loadingState.c === 3 && state.loadingState.a === 3 && state.loadingState.b === 3) {
    let data: DataModel[] = [];
    for (let x = 0; x < state.data.Data.Confirmed.length; x++) {
      const quickData = { ...state.data.Data };
      if (quickData.Deaths[x].Cases !== 0 || quickData.Recovered[x].Cases !== 0 || quickData.Confirmed[x].Cases || 0) {
        data.push({
          Confirmed: state.data.Data.Confirmed[x].Cases,
          Deaths: state.data.Data.Deaths[x].Cases,
          Recovered: state.data.Data.Recovered[x].Cases,
          Date: state.data.Data.Recovered[x].Date,
        });
      }
    }
    const renderLineChart = (
      <LineChart width={width - 50} height={height - 200} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Confirmed" stroke="#8884d8" />
        <Line type="monotone" dataKey="Deaths" stroke="#800000" />
        <Line type="monotone" dataKey="Recovered" stroke="#42ca5d" />
      </LineChart>
    );

    return (
      <div>
        {renderLineChart}
      </div>
    );
  }
  return (
    <div className="container mx-auto">
      <div className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
        <h1 className="text-xl">{state.loadingState.a === 3 ? 'Loading...' : 'Failed to load data'}</h1>
      </div>
    </div>
  );
}

export default CountryDetails;