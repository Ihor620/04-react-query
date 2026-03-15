import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import ReactPaginate from "react-paginate"
import { Toaster } from "react-hot-toast"

import SearchBar from "../SearchBar/SearchBar"
import MovieGrid from "../MovieGrid/MovieGrid"
import MovieModal from "../MovieModal/MovieModal"
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessage/ErrorMessage"

import { fetchMovies } from "../../services/movieService"
import type { Movie } from "../../types/movie"

import css from "./App.module.css"

export default function App() {

  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
  })

  const movies = data?.results ?? []
  const totalPages = data?.total_pages ?? 0

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    setPage(1)
  }

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      <Toaster position="top-right" />

      {isLoading && <Loader />}

      {isError && <ErrorMessage />}

      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      
      {movies.length > 0 && (
        <MovieGrid
          movies={movies}
          onSelect={setSelectedMovie}
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  )
}