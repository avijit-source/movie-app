import axios from 'axios';
import React, { Component } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import API_KEY from "../apiKey"

export default class Movies extends Component {
    constructor(props) {
        super(props)
        this.state = {
            parr: [1],
            currPage: 1,
            movies: [],
            favorites: [],
            openModal: false,
            currModalMovie: {}
        }
    }

    async componentDidMount() {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currPage}`);
        let data = res.data;
        this.setState({
            movies: [...data.results]
        })
        this.handleFavoriteState();
    }

    fetchMovies = async () => {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currPage}`);
        let data = res.data;
        this.setState({
            movies: [...data.results]
        })
        console.log(data);
    }

    handleNext = () => {
        let tempArr = [];
        for (let i = 1; i <= this.state.parr.length + 1; i++) {
            tempArr.push(i)
        }
        this.setState({
            parr: [...tempArr],
            currPage: this.state.currPage + 1
        }, this.fetchMovies);
    }


    handlePrev = () => {
        if (this.state.currPage !== 1) {
            this.setState({
                currPage: this.state.currPage - 1
            }, this.fetchMovies);
        }
    }
    handlePage = (val) => {
        if (val !== this.state.currPage) {
            this.setState({
                currPage: val
            }, this.fetchMovies);
        }
    }

    handleFavorite = (movie) => {
        let favs = JSON.parse(localStorage.getItem("movies")) || [];
        // console.log(favs[0].id);
        // console.log(this.state.favorites);
        if (this.state.favorites.includes(movie.id)) {
            favs = favs.filter(m => m.id !== movie.id);
        } else {
            favs.push(movie)
        }
        localStorage.setItem("movies", JSON.stringify(favs));
        this.handleFavoriteState();
    }

    handleFavoriteState = () => {
        let moviedata = JSON.parse(localStorage.getItem("movies")) || [];
        let temp = moviedata.map(m => m.id);
        this.setState({
            favorites: [...temp]
        })
    }

    onClickButton = (e, movie) => {
        e.preventDefault()
        this.setState({ openModal: true, currModalMovie: movie })
    }

    onCloseModal = () => {
        this.setState({ openModal: false })
    }
    render() {
        return (
            <>

                {
                    this.state.movies.length === 0 ?
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden text-center">Loading...</span>
                        </div>
                        :
                        <div className="container-fluid">
                            <Modal open={this.state.openModal} onClose={this.onCloseModal}>
                                <div className="container-fluid">
                                    <h4 className="mt-4">{this.state.currModalMovie.title} ({this.state.currModalMovie.adult===true ? "18+" : "PG-13"})</h4>
                                    <p>{this.state.currModalMovie.overview}</p>
                                    <h5>Release Date: <span className='text-primary'>{this.state.currModalMovie.release_date}</span></h5>
                                    <h5>Rating: <span className="text-danger">{this.state.currModalMovie.vote_average}</span> by total <span className='txet-success'>{this.state.currModalMovie.vote_count}</span> voters</h5>
                                    <h5></h5>
                                </div>

                            </Modal>
                            {/* <Navbar /> */}

                            <div className='movies-list'>

                                {
                                    this.state.movies.map(movieObj => (
                                        <div className="movie-list-main">
                                            <div className="card movie-card p-4 mb-2 border border-dark">
                                                <img src={`https://image.tmdb.org/t/p/w500${movieObj.backdrop_path}`} className="card-img-top" style={{ height: "50vh" }} alt="..." />
                                                {/* <div className="card-body"> */}
                                                <h5 className="card-title movie-title mt-2">{movieObj.original_title}</h5>
                                                {/* <p className="card-text movie-text">{movieObj.overview}</p> */}
                                                <h5 className="card-title movie-title mt-2">Rating: {movieObj.vote_average} (by {movieObj.vote_count} voters)</h5>
                                                <div className="btn-wrapper">
                                                    <a className="btn btn-dark mt-2 mb-1 movies-button" onClick={(e) => this.onClickButton(e, movieObj)}>Details</a>
                                                    <a className="btn btn-dark mt-2 mb-1 movies-button" onClick={() => this.handleFavorite(movieObj)}>{this.state.favorites.includes(movieObj.id) ? "Remove from" : "Add to"} favorites</a>
                                                </div>
                                            </div>
                                        </div>

                                    ))
                                }
                                <div className="container-fluid" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination">
                                            <li className="page-item"><a className="page-link" onClick={this.handlePrev}>Previous</a></li>
                                            {
                                                this.state.parr.map(val => {
                                                    return <li className="page-item"><a className="page-link" onClick={() => this.handlePage(val)}>{val}</a></li>
                                                })
                                            }

                                            <li className="page-item"><a className="page-link" onClick={this.handleNext}>Next</a></li>
                                        </ul>
                                    </nav>


                                </div>
                            </div>
                        </div>
                }
            </>
        )
    }
}
