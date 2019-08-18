import React, { Component } from 'react';
import { JobList } from './JobList';
import { loadCompany } from './requests';

export class CompanyDetail extends Component {
  constructor(props) {
    super(props);

    this.state = { company: null };
  }

  async componentDidMount() {
    const { companyId } = this.props.match.params;
    const company = await loadCompany(companyId);
    this.setState({ company });
  }

  render() {
    const { company } = this.state;

    if (!company) { return null; }

    return (
      <div>
        <h1 className="title">{company.name}</h1>
        <div className="box">{company.description}</div>
        <div className="title is-5">Jobs at {company.name}</div>
        <JobList jobs={company.jobs}></JobList>
      </div>
    );
  }
}
