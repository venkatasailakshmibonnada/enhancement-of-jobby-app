import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {title, rating, location, employmentType, companyLogoUrl} = jobDetails

  return (
    <li className='job-item'>
      <div className='company-container'>
        <img src={companyLogoUrl} alt='company logo' className='company-logo' />
        <div>
          <h1 className='title'>{title}</h1>
          <p className='rating'>⭐ {rating}</p>
        </div>
      </div>

      <div className='job-details'>
        <p className='location'>{location}</p>
        <p className='employment-type'>{employmentType}</p>
      </div>
    </li>
  )
}

export default JobItem
