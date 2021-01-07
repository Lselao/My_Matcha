import React, { Component, Fragment } from 'react'
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import SearchFilterModal from './modals/SearchFilterModal';
import { Container } from 'reactstrap';

class SearchResults extends Component {

    getResults = () =>{
        if (this.props.location.state){
            return (this.props.location.state.results)
        }else{
            this.props.history.push({
                pathname: '/',
            })
        }
    }

    render() {
        let results = this.getResults();
        return (
            (results && results[0] ? (
                <Fragment>
                    <SearchFilterModal fromSearch="true"/>
                    <div className="Profiles">
                        {results.map((result) => {
                            return (
                                <Link to={"/profile/" + result.id} key={result.id}>
                                    <div className="ProfileCard">
                                        <img src={result?.profilePic?.picUrl} alt="" />
                                        <p>{result.username}</p>
                                        <p>{result.bio}</p>
                                        <p>{result.age}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </Fragment>
              ) : 
              <Fragment>
                  <SearchFilterModal fromSearch="true"/>
                  <Container>
                      No results found....
                  </Container>
              </Fragment> )
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
  });
  
export default withRouter(connect(mapStateToProps, {})(SearchResults));
