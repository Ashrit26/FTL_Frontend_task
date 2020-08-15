import React, { Component } from 'react';
import styled from 'styled-components'

class Header extends Component {
    state={value:''}
    render() { 
        var file = this.props.file;
        return (  
            <Bar>
                <SearchBar>
                    <Search 
                        disabled={!file} 
                        value={this.state.value} 
                        onKeyDown={
                            (e)=>{
                                if(e.keyCode === 8 || e.keyCode === 46); 
                                    this.props.search(e.target.value);
                            }
                        }
                        onChange={
                            (e)=>{
                                e.preventDefault(); 
                                this.setState({value:e.target.value}); 
                                this.props.search(e.target.value);
                            }
                        } 
                        placeholder={file?'Search by name, code or timezone.':'Drop a file to get started.'} 
                    />
                </SearchBar>
            </Bar>
        );
    }
}
 
export default Header;

const Bar = styled.div`
    position:fixed;
    height:4rem;
    background-color:#1F2022;
    width:100%;
    display:flex;
    align-items:center;
`;

const SearchBar = styled.div`
    width:50%;
    min-width:280px;
    margin:auto;
`;

const Search = styled.input`
    background:rgba(255,255,255,0.1);
    border:1px solid grey;
    padding:0.5rem 3%;
    border-radius:0.5rem;
    font-size:1.5rem;
    width:92%;
    color:white;

    &:focus{ outline:none; }

`;