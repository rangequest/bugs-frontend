import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getUnresolvedBugs, loadBugs, resolveBug } from '../store/bugs'

class Bugs extends Component {
  componentDidMount() {
    this.props.loadBugs()
  }

  render() {
    return (
      <ul>
        {this.props.bugs.map(bug => (
          <li key={bug.id}>
            {bug.description} - <button onClick={() => this.props.resolveBug(bug.id)}>Resolve</button>
          </li>
        ))}
      </ul>
    )
  }
}

const mapStateToProps = state => ({
  bugs: getUnresolvedBugs(state),
})

const mapDispatchToProps = dispatch => ({
  loadBugs: () => dispatch(loadBugs()),
  resolveBug: id => dispatch(resolveBug(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Bugs)
