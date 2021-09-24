import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadBugs } from '../store/bugs'

class Bugs extends Component {
  componentDidMount() {
    this.props.loadBugs()
  }

  render() {
    return (
      <ul>
        {this.props.bugs.map(bug => (
          <li key={bug.id}>{bug.description}</li>
        ))}
      </ul>
    )
  }
}

const mapStateToProps = state => ({
  bugs: state.entities.bugs.list,
})

const mapDispatchToProps = dispatch => ({
  loadBugs: () => dispatch(loadBugs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Bugs)
