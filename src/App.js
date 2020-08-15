import React, { Component } from 'react';
import Header from './Header';
import DropFile from './DropFile';
import Activity from './Activity';

class App extends Component {
    state = { 
        file : false, 
        reading : false,
        error:false,
        data:{},
        users:[]
    }
    handleFile = file => {
        this.setState({reading:true});
        if(file.type && file.type.indexOf('json')===-1){
            this.setState({error:'That file was not a json file. Try again. ;)',reading:false});
            return;
        }
        var reader = new FileReader();
        var jsonData, that = this ;
        reader.addEventListener('load', (event) => {
            try {
                jsonData = JSON.parse(event.target.result);
                that.setState({reading:false,file:true,data:jsonData,users:jsonData.members});
            } catch (error) {
                that.setState({error:'There appears to be a mistake in your json file. Please verify and try again.',reading:false});
                console.log('More about the error : ');
                console.log(error);
            }
        });
        reader.readAsText(file);        
    }
    search = (text) => {
        if(text===''){
            this.setState({users:this.state.data.members})
            return;
        }
        var allUsers = this.state.data.members;
        var users = [];
        text= text.toLowerCase()
        var name, id, timezone;
        allUsers.map((user)=>{
            name = user.real_name.toLowerCase();
            id = user.id.toLowerCase();
            timezone = user.tz.toLowerCase();
            if(name.includes(text))
                users.push(user);                
            else if(id.includes(text))
                users.push(user);
            else if(timezone.includes(text))
                users.push(user)
            return 1;
        })
        this.setState({users:users})
    }
    render() { 
        var {reading, file, error,users} = this.state;
        return (  
            <div style={{height:'100vh',width:'100vw',position:'absolute',overflow:'hidden'}}>
                <Header file={file} search={this.search} />
                {!file && <DropFile read={this.handleFile} reading={reading} error={error} />}
                {file && <Activity users = {users} /> }
            </div>
        );
    }
}
 
export default App;