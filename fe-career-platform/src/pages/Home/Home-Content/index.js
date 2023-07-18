import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import React, { Component } from 'react'

const fakerData = [
    {
        postingId: 'asdasdasdasdasdasd',
        companyName: 'Google Inc',
        title: 'Full Stack Developer',
        location: 'remote',
        salary: '100~150K',
        skillSets: ['Web progarmming', '10+ Working experience'],
        description: "ahjsoidljaoilsjdoliasjdliajsdljasldjaljdslkjadlkajslkdjlaksjdlkajdslkjalkdjsalkdjlakjdlkajdslkjalkdjlskajdlkajdlkajdlkjalkjd"
    },
    {
        postingId: 'asdasdkajshdkajhsdkjhaskjdhkajshdkj',
        companyName: 'Faker Inc',
        title: 'Full Stack Developer',
        location: 'remote',
        salary: '100~150K',
        skillSets: ['Web progarmming', '10+ Working experience'],
        description: "ahjsoidljaoilsjdoliasjdliajsdljasldjaljdslkjadlkajslkdjlaksjdlkajdslkjalkdjsalkdjlakjdlkajdslkjalkdjlskajdlkajdlkajdlkjalkjd"
    },
]

class HomeContent extends Component {
    state = {  } 
    render() { 
        return (<h1>
            {fakerData.map(((job) => (
                <Card sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                    
                    marginTop: 5,
                    marginLeft: 5,
                    
                    width: 1000,
                    height: 300
                    
                  }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Company Name: {job.companyName}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            Job Title: {job.title}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            Salary: {job.salary}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            Location: {job.location}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            Relatice Skills: {job.skillSets}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {job.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">
                            <Link   underline="none"
                                    color="inhert"
                                    variant="body1"
                                    href="/jobposting/postingId">Learn More</Link>
                        </Button>
                    </CardActions>
                </Card>
            )))}
        </h1>
        );
    }
}
 
export default HomeContent;