import React from 'react';
import '../styles/Search.scss'
import { useState, useEffect } from 'react';
import md5 from 'md5';
import Characters from './Characters';
import Comics from './Comics';
import LoadingGIF from '../images/spinner.gif'

const Search = () => {
    // setting up the state 
    const [characterName, setCharacterName] = useState("");
    const [characterData, setCharacterData] = useState(null)
    const [comicData, setComicData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // importing the api keys from meta.env
    const publicKey = import.meta.env.VITE_PUBLIC_KEY
    const privateKey = import.meta.env.VITE_PRIVATE_KEY

    const handleSubmit = (event) => {
        
       event.preventDefault(); // this is priventing the default behivour of the form
       // after the click on button the getCharacterData triggerd
        getCharacterData();
    }
    const getCharacterData = () => {
        setCharacterData(null)
        setComicData(null)

        const timeStamp = new Date().getTime();
        const hash = generateHash(timeStamp);

        const url = `https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}&nameStartsWith=${characterName}&limit=100`;

        setIsLoading(true)

        fetch(url)
            .then((response) => response.json())
            .then((result) => {
                setCharacterData(result.data);
                // console.log(result);
            }).catch((error) => {
                console.log("There was an error", error);
            }).finally(() => {
                setIsLoading(false);
            })

    }
    // if we include this then while writing a single latter  in taxtbox it request data and become very slow
    // it will search data without submitting
    // useEffect(() => {
    //     if (characterName) {
    //         getCharacterData();
    //     }
    // }, [characterName]);

    const getComicData = (characterId) => {
        window.scrollTo({ top: 0, left: 0 });

        const timeStamp = new Date().getTime();
        const hash = generateHash(timeStamp);

        const url = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}`;

        fetch(url)
            .then((response) => response.json())
            .then((result) => {
                setComicData(result.data);
                // console.log(result.data);
            })
            .catch(() => {
                console.log("error while getting comic data");
            });
    };


    const generateHash = (timeStamp) => {
        return md5(timeStamp + privateKey + publicKey);
    }

    const handleChange = (event) => {
        setCharacterName(event.target.value);
    }

    const handleReset = () => {
        setCharacterData(null)
        setComicData(null)
        setCharacterName(null)
    }

    return (
        <>

            <form className="search" onSubmit={handleSubmit}>

                <input type="text"
                    placeholder='Enter Character Name'
                    onChange={handleChange}
                />
                <div className='buttons'>
                    <button type="submit"> Get character data</button>
                    <button type="reset" className="reset" onClick={handleReset}>Reset</button>
                </div>
            </form>
            {isLoading ? (
                <img style={{ width: "100px", height: "100px" }} src={LoadingGIF} alt='loading...' />
            ) : (
                <div style={{ display: characterData === null ? "none" : "block" }}>
                    <h2 style={{ color: "#bfbfbf" }}>
                        I Found Amazing Comic About {characterName}
                    </h2>
                </div>

            )}
            {!comicData && characterData && characterData.results[0] && (
                <Characters data={characterData.results} onClick={getComicData} />
            )}
            {comicData && comicData.results[0] && <Comics data={comicData.results} />}


        </>
    )
}

export default Search;
