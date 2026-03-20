import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileData: {},
    searchInput: '',
    selectedEmploymentTypes: [],
    activeSalaryRangeId: '',
    selectedLocations: [],
    jobsApiStatus: apiStatusConstants.initial,
    profileApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profileData, profileApiStatus: apiStatusConstants.success})
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobsData = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {searchInput, selectedEmploymentTypes, activeSalaryRangeId} =
      this.state
    const jwtToken = Cookies.get('jwt_token')
    const employmentType = selectedEmploymentTypes.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const jobsList = data.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({jobsList, jobsApiStatus: apiStatusConstants.success})
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeEmploymentType = typeId => {
    const {selectedEmploymentTypes} = this.state
    if (selectedEmploymentTypes.includes(typeId)) {
      this.setState(
        prev => ({
          selectedEmploymentTypes: prev.selectedEmploymentTypes.filter(
            e => e !== typeId,
          ),
        }),
        this.getJobsData,
      )
    } else {
      this.setState(
        prev => ({
          selectedEmploymentTypes: [...prev.selectedEmploymentTypes, typeId],
        }),
        this.getJobsData,
      )
    }
  }

  onChangeSalaryRange = salaryId => {
    this.setState({activeSalaryRangeId: salaryId}, this.getJobsData)
  }

  onChangeLocation = locationId => {
    const {selectedLocations} = this.state
    if (selectedLocations.includes(locationId)) {
      this.setState(prev => ({
        selectedLocations: prev.selectedLocations.filter(l => l !== locationId),
      }))
    } else {
      this.setState(prev => ({
        selectedLocations: [...prev.selectedLocations, locationId],
      }))
    }
  }

  onChangeSearchInput = event =>
    this.setState({searchInput: event.target.value})

  onClickSearchButton = () => this.getJobsData()

  onKeyDownSearch = event => {
    if (event.key === 'Enter') this.getJobsData()
  }

  renderProfileSection = () => {
    const {profileApiStatus, profileData} = this.state

    if (profileApiStatus === apiStatusConstants.inProgress) {
      return (
        <div className='profile-loader' data-testid='loader'>
          <Loader type='ThreeDots' color='#ffffff' height={50} width={50} />
        </div>
      )
    }

    if (profileApiStatus === apiStatusConstants.failure) {
      return (
        <div className='profile-failure-view'>
          <button
            type='button'
            className='retry-button'
            onClick={this.getProfileData}
          >
            Retry
          </button>
        </div>
      )
    }

    return (
      <div className='profile-container'>
        <img
          src={profileData.profileImageUrl}
          alt='profile'
          className='profile-img'
        />
        <h1 className='profile-name'>{profileData.name}</h1>
        <p className='profile-bio'>{profileData.shortBio}</p>
      </div>
    )
  }

  renderJobsList = () => {
    const {jobsList, selectedLocations} = this.state
    const filteredJobs =
      selectedLocations.length > 0
        ? jobsList.filter(job => selectedLocations.includes(job.location))
        : jobsList

    if (filteredJobs.length === 0) {
      return (
        <div className='no-jobs-view'>
          <img
            src='https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'
            alt='no jobs'
            className='no-jobs-img'
          />
          <h1 className='no-jobs-heading'>No Jobs Found</h1>
          <p className='no-jobs-description'>
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }

    return (
      <ul className='jobs-list'>
        {filteredJobs.map(job => (
          <li key={job.id} className='job-card'>
            <Link to={`/jobs/${job.id}`} className='job-card-link'>
              <div className='job-card-top'>
                <img
                  src={job.companyLogoUrl}
                  alt='company logo'
                  className='company-logo'
                />
                <div className='job-title-container'>
                  <h1 className='job-title'>{job.title}</h1>
                  <div className='rating-container'>
                    <AiFillStar className='star-icon' />
                    <p className='job-rating'>{job.rating}</p>
                  </div>
                </div>
              </div>
              <div className='job-card-middle'>
                <div className='location-employment-container'>
                  <div className='location-container'>
                    <MdLocationOn className='location-icon' />
                    <p className='job-location'>{job.location}</p>
                  </div>
                  <div className='employment-type-container'>
                    <BsBriefcaseFill className='briefcase-icon' />
                    <p className='job-employment-type'>{job.employmentType}</p>
                  </div>
                </div>
                <p className='job-package'>{job.packagePerAnnum}</p>
              </div>
              <hr className='job-divider' />
              <h1 className='description-heading'>Description</h1>
              <p className='job-description'>{job.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderJobsSection = () => {
    const {jobsApiStatus} = this.state

    if (jobsApiStatus === apiStatusConstants.inProgress) {
      return (
        <div className='jobs-loader' data-testid='loader'>
          <Loader type='ThreeDots' color='#ffffff' height={50} width={50} />
        </div>
      )
    }

    if (jobsApiStatus === apiStatusConstants.failure) {
      return (
        <div className='jobs-failure-view'>
          <img
            src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
            alt='failure view'
            className='failure-img'
          />
          <h1 className='failure-heading'>Oops! Something Went Wrong</h1>
          <p className='failure-description'>
            We cannot seem to find the page you are looking for
          </p>
          <button
            type='button'
            className='retry-button'
            onClick={this.getJobsData}
          >
            Retry
          </button>
        </div>
      )
    }

    return this.renderJobsList()
  }

  render() {
    const {searchInput, activeSalaryRangeId, selectedLocations} = this.state
    return (
      <div className='jobs-page'>
        <Header history={this.props.history} />
        <div className='jobs-body'>
          <aside className='sidebar'>
            {this.renderProfileSection()}
            <hr className='sidebar-divider' />
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeEmploymentType={this.onChangeEmploymentType}
              changeSalaryRange={this.onChangeSalaryRange}
              changeLocation={this.onChangeLocation}
              selectedLocations={selectedLocations}
              activeSalaryRangeId={activeSalaryRangeId}
            />
          </aside>
          <div className='jobs-main'>
            <div className='search-container'>
              <input
                type='search'
                className='search-input'
                value={searchInput}
                placeholder='Search'
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onKeyDownSearch}
              />
              <button
                type='button'
                data-testid='searchButton'
                className='search-button'
                onClick={this.onClickSearchButton}
              >
                <BsSearch className='search-icon' />
              </button>
            </div>
            {this.renderJobsSection()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
