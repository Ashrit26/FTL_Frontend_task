import React, { Component } from 'react';
import styled, {css} from 'styled-components';

class DropFile extends Component {
    state = { 
        text : 'Drop a .json file here.',
        dragging : false
    }

    drop = React.createRef();
    
    componentDidMount() {
        let drop = this.drop.current;
        drop.addEventListener('dragenter', this.handleDragIn)
        drop.addEventListener('dragleave', this.handleDragOut)
        drop.addEventListener('dragover', this.handleDrag)
        drop.addEventListener('drop', this.handleDrop)
    }
    handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({dragging: true, text:'Drop it right there!'})
        }
    }
    handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({dragging:false, text:'Drop a .json file here.'})

    }
    handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ dragging: false })
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            this.props.read(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    }
    componentWillUnmount() {
        let drop = this.drop.current;
        drop.removeEventListener('dragenter', this.handleDragIn)
        drop.removeEventListener('dragleave', this.handleDragOut)
        drop.removeEventListener('dragover', this.handleDrag)
        drop.removeEventListener('drop', this.handleDrop)
    }
    render() { 
        var {text,dragging} = this.state;
        var reading = this.props.reading;
        if(this.props.error&&!dragging) text = this.props.error;
        return (  
            <DropContainer ref={this.drop} dragging={dragging} reading={reading}>
                {!reading? text : 'Reading file . . .'}
            </DropContainer>
        );
    }
}
 
export default DropFile;

const DropContainer = styled.div`
    margin-top:4rem;
    height:-webkit-fill-available;
    height:-moz-available;
    width:80%;
    background-color:none;
    display:flex;
    align-items:center;
    justify-content:center;
    color:white;
    font-size:3rem;
    transition:all 0.3s ease-in-out;
    padding:10%;

    ${props => props.dragging && css`
        background-color:rgba(0,0,0,0.4);
    `}
    ${props => props.reading && css`
        pointer-events:none;
    `}
`;