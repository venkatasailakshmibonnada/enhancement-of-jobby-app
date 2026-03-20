import './index.css'

const locationsList = [
  {id: 'HYDERABAD', label: 'Hyderabad'},
  {id: 'BANGALORE', label: 'Bangalore'},
  {id: 'CHENNAI', label: 'Chennai'},
  {id: 'DELHI', label: 'Delhi'},
  {id: 'MUMBAI', label: 'Mumbai'},
]

const LocationFilter = props => {
  const {changeLocation} = props

  return (
    <div>
      <h3>Location</h3>

      {locationsList.map(each => (
        <div key={each.id}>
          <input
            type='checkbox'
            value={each.id}
            onChange={e => changeLocation(e.target.value)}
          />
          {each.label}
        </div>
      ))}
    </div>
  )
}

export default LocationFilter
