import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import './challengesList.scss';
import ChallengeCard from "../UI/challenge-card";

import { fetchChallenges } from "../../store/actions/challenges";
import { updateFavourites } from "../../store/actions/favourites";
import Spinner from "../../spinner/Spinner";
import ErrorIndicator from "../../error-indicator";

const Challenges = (props) => {
    const [sortParam, setSortParam] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('asc');
    const [limitOfChallengesOnPage, setLimitOfChallengesOnPage] = useState(10);
    const [page, setPage] = useState(1);
    const challengesObj = useSelector(state => state.challenges.challenges);
    const error = useSelector(state => state.challenges.error);
    const favourites = useSelector(state => state.favourites.favourites);
    const challengesList = challengesObj.challengesList;
    const totalPagesNum = challengesObj.totalPages;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchChallenges(sortParam, page, sortDirection, limitOfChallengesOnPage));
    }, [dispatch, sortParam, page, sortDirection, limitOfChallengesOnPage]);

    const updateFavsListHandler = (upIndex, challenge) => {
        updateFavourites(upIndex, challenge, dispatch, favourites);
    };

    return (
        <Grid container direction="column" className="challenges-list">
            <Grid container direction="row" justify="space-around" className="challenges-list-header">
                <h1>ALL CHALLENGES</h1>
                <select className="challenges-list-select" onChange={(event) => {
                    setSortParam(event.target.value);
                }}>
                    <option value="createdAt">Created At</option>
                    <option value="challengeName">Challenge Name</option>
                    <option value="numberOfQuestions">Number Of Questions</option>
                </select>
                <select className="challenges-list-select" onChange={(event) => {
                    setSortDirection(event.target.value);
                }}>
                    <option value="asc">Low to High</option>
                    <option value="dsc">High to Low</option>
                </select>
                <select className="challenges-list-select" onChange={(event) => {
                    setLimitOfChallengesOnPage(event.target.value);
                }}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </Grid>
            <Grid container direction="row" justify="space-around">
                {
                    error ? <ErrorIndicator error={ error }/> :
                        challengesList ?
                            challengesList.length > 0 ?
                                challengesList.map(challenge => <ChallengeCard key={ challenge.challengeId }
                                                                               challenge={ challenge }
                                                                               updateFavs={ updateFavsListHandler }/>)
                                : <div>There are no challenges</div>
                        : <Spinner/>
                }
            </Grid>
            <Grid container direction="row" justify="center" alignItems="center" className="pagination-container">
                {
                    challengesList && <Pagination count={totalPagesNum}
                                                  page={page}
                                                  onChange={(event, page) => {
                                                      setPage(page);
                                                  }}/>
                }
            </Grid>
        </Grid>
    );
};

export default Challenges;
