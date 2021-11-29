import { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [characters, setCharacters] = useState([])
  useEffect(() => {
    async function loadEpisodes(character) {
      const episodeUrls = character.episode // sacamos las urls
      for (let k=0; k < episodeUrls.length; k++) {
        const url = episodeUrls[k]
        const response = await fetch(url)
        const data = await response.json()
        setCharacters(characters => {
          return characters.map(c => {
            if (c.id === character.id) {
              return { ...c, episodes: c.episodes.concat(data) }
            } else {
              return c
            }
          })
        })
      }
    }

    async function load() {
      const response = await fetch("https://rickandmortyapi.com/api/character")
      const data = await response.json()

      let results = data.results
      results = results.map(result => ({ ...result, episodes: [] }))
      setCharacters(results)

      for (let i=0; i < results.length; i++) {
        const result = results[i]
        await loadEpisodes(result)
      }
    }

    // load()

    fetch("https://rickandmortyapi.com/api/character")
      .then(response => response.json())
      .then(data => {
        let results = data.results // personajes

        // results.forEach(result => result.episodes = []) // mutando cada objeto
        results = results.map(result => ({ ...result, episodes: [] })) // agregarle una llave episodes a cada personaje
        
        setCharacters(results) // episodes es vacío en cada objeto
        
        results.forEach(result => { // por cada personaje
          const episodeUrls = result.episode // sacar las urls de los episodios

          const promises = episodeUrls.map(url => fetch(url).then(res => res.json()))

          Promise.all(promises).then(episodes => {
            setCharacters(characters => {
              return characters.map(c => c.id === result.id ? { ...c, episodes: episodes } : c)
            })
          })
        })
      })
  }, [])

  return (
    <div className="App">
      <table>
        <thead></thead>
        <tbody>
        {characters.map(c => (
          <tr>
            <td>{c.name}</td>
            <td>
              {c.episodes.map(e => <li key={e.id}>{e.name}</li>)}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      
    </div>
  );
}

export default App;


 // results.forEach(result => {
        //   const episodeUrls = result.episode
        //   const promises = episodeUrls.map(url => fetch(url).then(res => res.json()))
        //   console.log(promises) // [Promise, Promise, Promise]
          
        //   // Promise.all(promises)
        //   //   .then(episodes => result.episodes = episodes)
        // })