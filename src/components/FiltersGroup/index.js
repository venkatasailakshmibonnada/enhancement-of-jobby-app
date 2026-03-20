import './index.css'

const locationsList = [
  {locationId: 'Hyderabad', label: 'Hyderabad'},
  {locationId: 'Bangalore', label: 'Bangalore'},
  {locationId: 'Chennai', label: 'Chennai'},
  {locationId: 'Delhi', label: 'Delhi'},
  {locationId: 'Mumbai', label: 'Mumbai'},
]

const FiltersGroup = ({
  employmentTypesList,
  salaryRangesList,
  changeEmploymentType,
  changeSalaryRange,
  changeLocation,
  selectedLocations,
  activeSalaryRangeId,
}) => {
  const onChangeEmploymentType = event => {
    changeEmploymentType(event.target.value)
  }

  const onChangeSalaryRange = event => {
    changeSalaryRange(event.target.value)
  }

  const onChangeLocation = event => {
    changeLocation(event.target.value)
  }

  return (
    <div className='filters-group-container'>
      <h2 className='filter-heading'>Type of Employment</h2>
      <ul className='employment-types-list'>
        {employmentTypesList.map(eachType => (
          <li key={eachType.employmentTypeId} className='filter-item'>
            <input
              type='checkbox'
              id={eachType.employmentTypeId}
              className='checkbox-input'
              value={eachType.employmentTypeId}
              onChange={onChangeEmploymentType}
            />
            <label htmlFor={eachType.employmentTypeId} className='filter-label'>
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>

      <hr className='filter-divider' />

      <h2 className='filter-heading'>Salary Range</h2>
      <ul className='salary-ranges-list'>
        {salaryRangesList.map(eachRange => (
          <li key={eachRange.salaryRangeId} className='filter-item'>
            <input
              type='radio'
              id={eachRange.salaryRangeId}
              className='radio-input'
              name='salary'
              value={eachRange.salaryRangeId}
              checked={activeSalaryRangeId === eachRange.salaryRangeId}
              onChange={onChangeSalaryRange}
            />
            <label htmlFor={eachRange.salaryRangeId} className='filter-label'>
              {eachRange.label}
            </label>
          </li>
        ))}
      </ul>

      <hr className='filter-divider' />

      <h2 className='filter-heading'>Locations</h2>
      <ul className='locations-list'>
        {locationsList.map(location => (
          <li key={location.locationId} className='filter-item'>
            <input
              type='checkbox'
              id={location.locationId}
              className='checkbox-input'
              value={location.locationId}
              checked={selectedLocations.includes(location.locationId)}
              onChange={onChangeLocation}
            />
            <label htmlFor={location.locationId} className='filter-label'>
              {location.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FiltersGroup
