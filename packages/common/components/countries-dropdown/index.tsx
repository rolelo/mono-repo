import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import React, { useMemo } from 'react'
import { useQuery } from 'react-query';

const getCountriesAndCities = async () => {
  const response = await fetch('https://countriesnow.space/api/v0.1/countries');
  const { data } = await response.json();
  return data;
}

const CountriesDropdown: React.FC = () => {
  const { data } = useQuery<{
    country: string,
    cities: string[]
  }[]>('fetchCountriesAndCities', getCountriesAndCities);
  const options = useMemo(() => {
    if (!data?.length) return [];
    
    const flattenedData: { label: string, value: string }[] = [];
    for (let i = 0; i <= data.length - 1; i++) { 
      const country = data[i].country;
      data[i].cities.forEach((city) => {
        const label = `${country}, ${city}`;
        flattenedData.push({ label, value: label })
      })
    }
  
    return flattenedData;
   }, [data]);
  return (
    <Autocomplete
      id="combo-box-demo"
      filterOptions={createFilterOptions({ matchFrom: 'any', limit: 50 })}
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Location" />}
    />
  )
}

export default CountriesDropdown