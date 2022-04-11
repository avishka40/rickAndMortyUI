import React , {Suspense, useState , useEffect} from "react"
import { gql,useQuery,useMutation,useLazyQuery } from "@apollo/client";
import { Grid } from "@mui/material"
import StyledAppBar from "./common/StyledAppBar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import RickAndMortyCard from "./Card"
// const RickAndMortyCard = React.lazy(()=> import("./Card"))



const StyledGrid = styled(Grid)`
margin-bottom: 10px;
`

const CHARACTERS_QUERY = gql`
    query Characters($page: Int) {
        characters( page : $page ) {
            results {
                id
                name
                image
                species
                status
              
                origin {
                    name
                }
                location { 
                    name
                    dimension
                }
                episode {
                    name    
                    air_date
                }
            }
          }
      }
   `;

   const CHARACTERS_QUERY_FLOAT = gql`
   query Characters($page: Float!) {
       characters( page : $page ) {
           results {
               id
               name
               image
               species
               status
               gender
               origin {
                   name
               }
               location { 
                   name
                   dimension
               }
               episode {
                   name    
                   air_date
               }
           }
         }
     }
  `;
  const SET_FAVOURITES_USER = gql`
  mutation SetFavourite($username: String!, $id: String!) {
    setFavourite(username: $username, id: $id ) {
         username
         favorites
    }
  }
 `;
 const GET_FAVOURITES_CHARACTERS = gql`
 query Characters($favorites: [String!]!) {
 getFavourites(favorites: $favorites){
    results {
        id
        name
        image
        species
        status
      
        origin {
            name
        }
        location { 
            name
            dimension
        }
        episode {
            name    
            air_date
        }
    }
}
}
 `
 const USER_QUERY = gql`
 query GetUser($username: String!) {
     getUser( username : $username ) {
        username
        favorites
       }
   }
`;


const Home = () => {

    const[user,setUser] = useState("")
    const[favoritesIds,setFavoritesIds] = useState([])
    const[ isFavouriteVisible, setFavouriteVisible] = useState(false)
    const[ favouriteCharacters, setFavouriteCharacters] = useState([])
    const[favoritesIdsLoaded, setfavoritesIdsLoaded] = useState(false)
    const[page, setPage] = useState(1)
    const[characterData, setCharacterData] = useState<any[]>([])
    const navigate = useNavigate()

    const { loading, error } = useQuery(CHARACTERS_QUERY_FLOAT, {
        skip: characterData.length>0,
        onCompleted:(data)=>{
        setCharacterData(data.characters.results)
    },variables: {
        page: page
    }});
    const [getChracters] = useLazyQuery(CHARACTERS_QUERY_FLOAT,{onCompleted: (data)=>{
        console.log(data.characters.results)
        console.log(characterData)
        console.log("contact ",characterData.concat(data.characters.results))
        setCharacterData(characterData.concat(data.characters.results))
    }});
    const [setFavorite] = useMutation(SET_FAVOURITES_USER,{onCompleted: (data)=> {
        console.log("set favorites",data.setFavourite.favorites)
        if(data.setFavourite.favorites ){
            setFavoritesIds(data.setFavourite.favorites)
        }
       
    }});
    /**
     * Get Query and Identify Favourites of a user
     */
    const [getUser] = useLazyQuery (USER_QUERY, {
        onCompleted: (data)=> {
        
        //user exisits
        if(data!= null){
            console.log("setting user favourites",data.getUser.favorites )
             setFavoritesIds(data.getUser.favorites)
             setfavoritesIdsLoaded(true)
        } else {
           console.log("here")
        }
    }, onError: (error)=> {
        console.log(error)
    }});
    /**Get Favourite List on Demand */
    const [getFavourites] = useLazyQuery (GET_FAVOURITES_CHARACTERS, {
        onCompleted: (data)=> {
        console.log("here 3")
        setFavouriteCharacters(data.getFavourites.results)  
        setFavouriteVisible(true)  
        console.log(data)
    }, onError: (error)=> {
        console.log(error)
    }});
  

    /**
     * Use Effects
     */
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser==="") {
            navigate("/")
        }
        //fetching
        getUser({
            variables: {
                username: loggedInUser
            }
        })  
        if (loggedInUser) {
            console.log("logged in user", loggedInUser)
        //   const foundUser = JSON.parse(loggedInUser);
            setUser(loggedInUser);
        }
        return (()=>{
            console.log("unmounting")
            localStorage.setItem(user,"")
        })
      }, []);

    useEffect(()=>{
        console.log("onFavourites update", favoritesIds)
        if(favoritesIds.length>0){
            setfavoritesIdsLoaded(true)
        }
        
    },[favoritesIds])

    useEffect(()=>{
        console.log("chatacter update,", characterData)
    },[characterData])


    /**
     * Callbacks
     */
    /**
     * 
     * @param id Favourite icon click on Cards
     */
    const onFavouritesHandle = (id:any) =>{
        console.log("received id ", id)
        setFavorite(  {
            variables: { 
               username : user,
               id: id
           } 
       })
    }
    // const getFavouriteChractersOfUser = () => {
    //     getUser({
    //         variables: {
    //             username: user
    //         }
    //     })  
    // }
    /**
     * Fetch for infinite scroll
     */
    const fetchMoreData= () => {
        getChracters({variables: {
            page: page+1
        }})
        setPage(page+1)
    }

    const onLogout = () => {
        setUser("")
    }

    const showFavourites = () => {
        console.log("on show favourites")
        setFavouriteVisible(!isFavouriteVisible)
        getFavourites({
            variables: {
                favorites: favoritesIds
            }
        })
        // if(isFavouriteVisible){
        //     console.log("here 1")
        //     setFavouriteVisible(false)
        // }else{
        //     getFavourites({
        //         variables: {
        //             favorites: favoritesIds
        //         }
        //     })
        // }
       
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    // if(data){
    //     setCharacterData(data)
    // }
    if(user===""){
        navigate("/")
    }
  
    return (
    <Grid container>
        {/* header */}
        <StyledGrid item xs= {12}>
            <StyledAppBar  onLogout={onLogout} show={isFavouriteVisible} handleAppBarButton={showFavourites}></StyledAppBar>
        </StyledGrid>
        {/* body */}
        <Grid container>
            <Grid item  xs={3}></Grid>
            <Grid item  xs={6}>
                <Suspense fallback= {<div>Loading ...</div>}>
                    <Grid container>
                    
                     {!isFavouriteVisible && favoritesIdsLoaded && <InfiniteScroll
                        dataLength={characterData.length}
                        next={fetchMoreData}
                        hasMore={true}
                        loader= { <h4>Loading...</h4>}
                    >
                        { !isFavouriteVisible && favoritesIdsLoaded && characterData.map((result: any)=> {
                            
                            return (
                                <StyledGrid key={result.id} item xs={12}>
                                <RickAndMortyCard id ={result.id}characterName={result.name} image={result.image} origin = {result.origin.name}
                                status = {result.status} species ={result.species} 
                                dimension = {result.location.dimension} gender={result.gender}
                                 episode={result.episode}  onFavouritesClick={onFavouritesHandle}
                                 isFavourite={favoritesIds.find((e)=> e===result.id)!== undefined}/>
                                </StyledGrid>
                                )
                        })}
                    </InfiniteScroll>}
                        {/* favourites reneder part */}
                        { isFavouriteVisible &&  favouriteCharacters && favouriteCharacters.map((result: any)=> {
                            
                            return (
                                <StyledGrid key={result.id} item xs={12}>
                                <RickAndMortyCard id ={result.id}characterName={result.name} image={result.image} origin = {result.origin.name}
                                status = {result.status} species ={result.species} 
                                dimension = {result.location.dimension} gender={result.gender}
                                 episode={result.episode}  onFavouritesClick={onFavouritesHandle}
                                 isFavourite={favoritesIds.find((e)=> e===result.id)!== undefined}/>
                                </StyledGrid>
                                )
                        })}
                    </Grid>
            </Suspense>
            </Grid>
            <Grid item  xs={3}></Grid>
           
        
        </Grid>
    </Grid>)
}




{/* <RickAndMortyCard characterName="rick" image="https://www.uidownload.com/files/376/612/910/rick-morty-rick.jpg" origin = "earth"
        status = "alive" species ="human" dimension = "galaxy" gender="male" */}
        {/* ></RickAndMortyCard> */}

export default Home