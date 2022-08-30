import React, { Component } from 'react'
import { BiSortUp, BiSortDown } from 'react-icons/bi';

export default class Favourites extends Component {
    constructor() {
        super()
        this.state = {
            genres: [],
            currentGenre: "All genres",
            movies: [],
            currText: "",
            limit: 5,
            currPage: 1,
        }
    }
    componentDidMount() {
        let genreIds = {
            28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
            27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV', 53: 'Thriller', 10752: 'War', 37: 'Western'
        };

        let data = JSON.parse(localStorage.getItem("movies")) || [];
        let tempArr = [];
        data.forEach(m => {
            if (!tempArr.includes(genreIds[m.genre_ids[0]])) {
                tempArr.push(genreIds[m.genre_ids[0]]);
            }
        })
        tempArr.unshift("All genres");
        this.setState({
            genres: [...tempArr],
            movies: [...data]
        })

    }

    handleLinkChange = (genre) => {
        this.setState({
            currentGenre: genre
        })
    }

    handleSortPopularityDesc = () => {
        let tempArr = this.state.movies;
        tempArr.sort(function (a, b) {
            return b.popularity - a.popularity
        })
        this.setState({
            movies: [...tempArr]
        })

    }


    handleSortPopularityAsc = () => {
        let tempArr = this.state.movies;
        tempArr.sort(function (a, b) {
            return a.popularity - b.popularity
        })
        this.setState({
            movies: [...tempArr]
        })
    }

    handleSortRatingDesc = () => {
        let tempArr = this.state.movies;
        tempArr.sort(function (a, b) {
            return b.vote_average - a.vote_average
        })
        this.setState({
            movies: [...tempArr]
        })

    }

    handleSortRatingAsc = () => {
        let tempArr = this.state.movies;
        tempArr.sort(function (a, b) {
            return a.vote_average - b.vote_average
        })
        this.setState({
            movies: [...tempArr]
        })

    }

    handlePageChange = (p) => {
        this.setState({
            currPage: p
        })
    }

    handleDelete = (id) => {
      let tempArr = [];
      tempArr = this.state.movies.filter(m=>m.id!==id);
      this.setState({
        movies:[...tempArr]
      })
      localStorage.setItem("movies",JSON.stringify(tempArr))
    }
    render() {


        const styleObj = {
            background: "#3f51b5",
            color: "white", fontWeight: "bold"
        }
        let genreIds = {
            28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
            27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV', 53: 'Thriller', 10752: 'War', 37: 'Western'
        };
        let filteredArr = [];

        if (this.state.currText === "") {
            filteredArr = this.state.movies
        } else {
            filteredArr = this.state.movies.filter(m => {
                let title = m.original_title.toLowerCase();
                let searchTerm = this.state.currText.trim().toLowerCase();
                return title.includes(searchTerm)
            })
        }

        if (this.state.currentGenre !== "All genres") {
            filteredArr = this.state.movies.filter(m => genreIds[m.genre_ids[0]] === this.state.currentGenre)
        }


        let pages = Math.ceil(filteredArr.length / this.state.limit);
        let pagesArr = [];
        for (let i = 1; i <= pages; i++) {
            pagesArr.push(i)
        }
        let startIdx = (this.state.currPage - 1) * this.state.limit;

        let endIdx = startIdx + this.state.limit;

        filteredArr = filteredArr.slice(startIdx, endIdx)

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-sm-12">
                        <ul className="list-group favourites">
                            {
                                this.state.genres.map(gen => (
                                    <li className="list-group-item genres"
                                        style={this.state.currentGenre === gen ? styleObj : null} onClick={() => this.handleLinkChange(gen)}>{gen}</li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="col-lg-9 col-sm-12 favourites-table">
                        <div className="row inputs mt-lg-0 mt-sm-2">
                            <input type="text"
                                placeholder='search'
                                className="input-group-text col mx-2"
                                value={this.state.currText}
                                onChange={(e) => this.setState({ currText: e.target.value })}
                            />
                            <input type="number" placeholder="rows count"
                                className="input-group-text col"
                                value={this.state.limit}
                                onChange={(e)=>this.setState({limit:e.target.value})}
                            />

                        </div>
                        <div className="container-fluid main-content">
                            <div className="row">
                                <table class="table">
                                    <thead>
                                        <tr className="table-headers">
                                            <th scope="col">Title</th>
                                            <th scope="col">Genre</th>
                                            <th scope="col"><BiSortUp onClick={this.handleSortPopularityDesc} /> Popularity <BiSortDown onClick={this.handleSortPopularityAsc} /></th>
                                            <th scope="col"><BiSortUp onClick={this.handleSortRatingDesc} />Rating <BiSortDown onClick={this.handleSortRatingAsc} /></th>
                                            <th scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filteredArr.map(m => (
                                                <tr>
                                                    <td>
                                                        <img src={`https://image.tmdb.org/t/p/w500/${m.backdrop_path}`} alt={m.title} style={{ width: "5rem" }} /> <span style={{ display: "inline-block" }}>{m.original_title}</span></td>
                                                    <td>{genreIds[m.genre_ids[0]]}</td>
                                                    <td>{m.popularity}</td>
                                                    <td>{m.vote_average}</td>
                                                    <td><button type="button" className="btn btn-danger" onClick={()=>this.handleDelete(m.id)}>Delete</button></td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                {
                                    pagesArr.map((p) => (
                                        <li className="page-item"><a className="page-link" onClick={() => this.handlePageChange(p)}>{p}</a></li>

                                    ))
                                }
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        )
    }
}
