import { useState , FunctionComponent} from "react";
import { Card,CardHeader,Typography, CardContent, CardActions, Button, CardMedia, IconButton, Box ,Grid ,Collapse, List, ListItem,ListItemText} from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import styled from 'styled-components';
import ExpandMore from "./ExpandMore"

const StyledCard =  styled(Card)`
marginTop: 10px;
display: flex
`
const StyledDiv = styled.div`
margin-bottom: 10px;
`
const StyledCardContent = styled(CardContent)`
flex: 1 0 auto
`
 
const StyledCardActions = styled(CardActions)``
const StyledButton = styled(Button)``
const StyledHeader = styled(CardHeader) ``
const StyledTypography = styled(Typography)`
margin-bottom: 5px;
@media (max-width:1200px) {
    font-size: 1.0rem
};
@media (max-width:1000px) {
    font-size: 0.9rem
};
@media (max-width:800px) {
    font-size: 0.7rem
};
@media (max-width:600px) {
    font-size: 0.6rem
};
;`
const StyledCardMedia = styled(CardMedia)

interface Episode {
    name: string,
    air_date: string
}

interface Props {
    id:string,
    characterName: string;
    image: string;
    gender: string;
    dimension: string;
    origin: string;
    status: string;
    species: string;
    episode: Episode[] | null | undefined,
    onFavouritesClick:  Function,
    isFavourite:Boolean | null

}

const RickAndMortyCard : FunctionComponent<Props> = (props) => {
    /**
     * States
     */
    const [expanded, setExpanded] = useState(false);
    const [favorite,setFavorite] = useState(props.isFavourite)

    /**
     * Callbacks
     */
    const handleExpandClick = () => {
        setExpanded(!expanded);

    }
    return (
        <StyledCard  > 
            <Grid container>
                <Grid item xs={6}> 
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <StyledCardContent>
                            <StyledDiv>
                            <CardMedia
                             component="img"
                             height="194"
                             width = ""
                             image={props.image}
                             alt="image of RM Chatacter"
                            />
                            </StyledDiv>
                            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            </Box>  
                        </StyledCardContent>            
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{  pl: 1, pb: 1,  paddingTop: "14px" }}>
                        <Grid container >
                            <Grid item xs={5}>
                                <StyledTypography variant ="h6">Name:</StyledTypography>
                                <StyledTypography variant ="h6">Species:</StyledTypography>
                                <StyledTypography variant ="h6">Gender:</StyledTypography>
                                <StyledTypography variant ="h6">Origin:</StyledTypography>
                                <StyledTypography variant ="h6">Dimension: </StyledTypography>
                                <StyledTypography variant ="h6">Status:</StyledTypography>
                            </Grid>
                            <Grid item xs={7}>
                                <StyledTypography variant="h6"> { props.characterName} </StyledTypography>
                                <StyledTypography variant="h6">{ props.species}</StyledTypography>
                                <StyledTypography variant="h6">{ props.gender}</StyledTypography>
                                <StyledTypography variant="h6">{ props.origin}</StyledTypography>
                                <StyledTypography variant="h6">{ props.dimension}</StyledTypography>
                                <StyledTypography variant="h6">{ props.status}</StyledTypography>
                            </Grid>
                        </Grid>
                         
                       
                    </Box>  
                
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <IconButton onClick={()=> {
                        // can optimize this 
                        props.onFavouritesClick(props.id)
                        setFavorite(!favorite)
                        }} aria-label="add to favorites" sx={{ float: "right" }}>
                        {favorite ? <StarIcon /> : <StarOutlineIcon/>}
                     </IconButton>

                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                        sx={{ float: "right" }}
                    >
                        <ExpandMoreIcon />    
                    </ExpandMore>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>Latest episodes:</Typography>
                          
                            <List>
                                {props.episode && props.episode.map((episode)=>{
                                    return (  <ListItem key={episode.name}>
                                        <ListItemText primary={episode.name} secondary={episode.air_date}/>
                                    </ListItem>)
                                })}
                              
                             </List>
                        </CardContent>
                    </Collapse>
                </Grid>
            </Grid>
           
        
            <StyledCardActions>

            </StyledCardActions>
            
        </StyledCard>
    )
}

export default RickAndMortyCard
