import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    skills: [],
    lifeAtCompany: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobId = () => {
    const {match} = this.props
    if (match && match.params && match.params.id) {
      return match.params.id
    }
    return ''
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const id = this.getJobId()
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const jd = data.job_details
      const jobDetails = {
        companyLogoUrl: jd.company_logo_url,
        companyWebsiteUrl: jd.company_website_url,
        employmentType: jd.employment_type,
        id: jd.id,
        jobDescription: jd.job_description,
        location: jd.location,
        packagePerAnnum: jd.package_per_annum,
        rating: jd.rating,
        title: jd.title,
      }
      const skills = jd.skills.map(skill => ({
        imageUrl: skill.image_url,
        name: skill.name,
      }))
      const lifeAtCompany = {
        description: jd.life_at_company.description,
        imageUrl: jd.life_at_company.image_url,
      }
      const similarJobs = data.similar_jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobDetails,
        skills,
        lifeAtCompany,
        similarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccess = () => {
    const {jobDetails, similarJobs, skills, lifeAtCompany} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <div className="job-details-content">
        <div className="job-details-card">
          <div className="job-card-top">
            <img src={companyLogoUrl} alt="job details company logo" className="company-logo" />
            <div className="job-title-container">
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="job-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-card-middle">
            <div className="location-employment-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="job-location">{location}</p>
              </div>
              <div className="employment-type-container">
                <BsBriefcaseFill className="briefcase-icon" />
                <p className="job-employment-type">{employmentType}</p>
              </div>
            </div>
            <p className="job-package">{packagePerAnnum}</p>
          </div>
          <hr className="job-divider" />
          <div className="description-header">
            <h1 className="description-heading">Description</h1>
            <a href={companyWebsiteUrl} target="_blank" rel="noreferrer" className="visit-link">
              Visit <BiLinkExternal />
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map(skill => (
              <li key={skill.name} className="skill-item">
                <img src={skill.imageUrl} alt={skill.name} className="skill-img" />
                <p className="skill-name">{skill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-description">{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" className="life-img" />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(job => (
            <li key={job.id} className="similar-job-card">
              <div className="job-card-top">
                <img src={job.companyLogoUrl} alt="similar job company logo" className="company-logo" />
                <div className="job-title-container">
                  <h1 className="job-title">{job.title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="job-rating">{job.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="description-heading">Description</h1>
              <p className="job-description">{job.jobDescription}</p>
              <div className="location-employment-container" style={{marginTop: '12px'}}>
                <div className="location-container">
                  <MdLocationOn className="location-icon" />
                  <p className="job-location">{job.location}</p>
                </div>
                <div className="employment-type-container">
                  <BsBriefcaseFill className="briefcase-icon" />
                  <p className="job-employment-type">{job.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    return (
      <div className="job-details-page">
        <Header history={this.props.history} />
        <div className="job-details-body">
          {apiStatus === apiStatusConstants.inProgress && (
            <div className="job-details-loader" data-testid="loader">
              <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
            </div>
          )}
          {apiStatus === apiStatusConstants.failure && (
            <div className="job-details-failure">
              <img src="https://assets.ccbp.in/frontend/react-js/failure-img.png" alt="failure view" className="failure-img" />
              <h1 className="failure-heading">Oops! Something Went Wrong</h1>
              <p className="failure-description">We cannot seem to find the page you are looking for</p>
              <button type="button" className="retry-button" onClick={this.getJobDetails}>Retry</button>
            </div>
          )}
          {apiStatus === apiStatusConstants.success && this.renderSuccess()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
