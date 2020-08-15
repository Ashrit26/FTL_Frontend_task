import React, { Component } from 'react';
import styled, {css} from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import moment from 'moment-timezone';
import Calendar from 'react-calendar';
import './Calendar.css';

class Activity extends Component {
    state = { 
        users : this.props.users,
        current : null,
        show : false,
        dates:[],
        dayView:true,
        today:true,
        activity:[],
        other:false
    }
    showInfo = user => {
        var dates=[], acitivityToday=[], d;
        var activity = user.activity_periods;
        activity.map(date=>{
            d = moment(date.start_time, 'MMM D YYYY h:mma').tz(user.tz).format('D-M-YY');
            dates.push(d);
            if(moment(date.start_time, 'MMM D YYYY h:mma').tz(user.tz).isSame(new Date(),"date")){
                var startTime = moment(date.start_time, 'MMM D YYYY h:mma').tz(user.tz).format('h:mm A');
                var endTime = moment(date.end_time, 'MMM D YYYY h:mma').tz(user.tz).format('h:mm A');
                acitivityToday.push(startTime + ' to ' + endTime)
            }
            return 1;
        });
        this.setState({show:true,current:user,dates:dates,activity:acitivityToday})
    }
    getActivity = (d) => {
        var activity = this.state.current.activity_periods;
        var timezone = this.state.current.tz;
        var specificActivity = [];
        var date = moment(d).format('D-M-YY');
        activity.map(act => {
            if(moment(act.start_time,'MMM D YYYY h:mma').tz(timezone).format('D-M-YY')===date){
                var startTime = moment(act.start_time, 'MMM D YYYY h:mma').tz(timezone).format('h:mm A');
                var endTime = moment(act.end_time, 'MMM D YYYY h:mma').tz(timezone).format('h:mm A');
                specificActivity.push(startTime + ' to ' + endTime);
            }
            return 1;
        })
        this.setState({today:false,dayView:true,other:true,activity:specificActivity,otherDate:moment(d).format('D MMM YY')})
    }  
    componentDidUpdate(prevProps) {
        if(prevProps.users!==this.props.users) this.setState({users:this.props.users});
    }  
    render() { 
        var {users,show,current,dates,dayView,today,activity,other,otherDate} = this.state;
        var empty = false; 
        var modalStyle = {maxWidth:'85vw',margin:'auto',padding:'1rem 2rem 2rem 2rem',backgroundColor:'white',marginTop:'7rem',outline:'none',width:'max-content',borderRadius:'1rem',minWidth:'30rem',minHeight:'20rem'}
        if(users === undefined || users.length===0) empty = true;
        return (  
            <Container empty={empty}>
                {empty && <span>No users found.</span>}
                {!empty &&
                    <Grid container spacing={0}>
                        {
                            users.map((user,index)=>{
                                return(
                                    <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={2}>
                                        <Card variant='elevation' style={{width:'90%',margin:'1rem auto'}} >
                                            <CardContent>
                                                <div style={{fontSize:'1.5rem'}}>{user.real_name}</div>
                                                ID : {user.id}<br/>
                                                Timezone : {user.tz}
                                            </CardContent>
                                            <CardActions style={{justifyContent:'flex-end'}}>
                                                <Button color='primary' variant='contained' onClick={()=>{this.showInfo(user)}} style={{float:'right'}}>See activity</Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                }
                <Modal open={show} onClose={()=>{this.setState({show:false,dayView:true,today:true,other:false})}}>
                    <div style={modalStyle}>
                        {current &&
                            <div>
                                <h2>
                                    {current.real_name}
                                    <Button onClick={() => { this.setState({ dayView: true,show:false,today:true,other:false }) }} color='primary' variant='outlined' style={{ float: 'right'}}>
                                        <CloseIcon  />
                                    </Button>
                                </h2>
                                {dayView &&
                                    <div>
                                        <h3>
                                            {today && 'Today'} 
                                            {other && <>{otherDate}</>}
                                            <Button onClick={()=>{this.setState({dayView:false})}} color='primary' variant='outlined' style={{float:'right'}}>
                                                All Activity
                                            </Button>
                                        </h3>
                                        <div style={{marginTop:'-1rem',fontSize:'0.75rem'}}>All times are in local timezone.</div>
                                        <hr/>
                                        {activity.length===0?
                                            "No activity":
                                            <div>
                                                {activity.map((act,index)=><div key={index}>{act}</div>)}
                                            </div>
                                        }
                                    </div>
                                }
                                {!dayView &&
                                    <div>
                                        <h3>All activity</h3>
                                        <Calendar
                                            tileClassName={({ date, view }) => {
                                                if (dates.find(x => x === moment(date).format('D-M-YY'))) {
                                                    return 'date-highlight'
                                                }
                                            }}
                                            defaultView='year'
                                            onChange={(value,view)=>{this.getActivity(value)}}
                                        />
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </Modal>
            </Container>
        );
    }
}
 
export default Activity;

const Container = styled.div`
    width:100%;
    margin-top:4rem;
    height:-webkit-fill-available;
    height:-moz-available;

    ${props => props.empty && css`
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:3rem;
        color:white;
    `}
`;