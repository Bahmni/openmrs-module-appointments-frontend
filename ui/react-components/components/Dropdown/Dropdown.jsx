import React, {Component} from 'react';
import AysncSelect from "react-select/async";

export default class Dropdown extends Component{
    constructor(props) {
        super(props);
        this.state = { inputValue: ""};
        this.handleInputChange = this.handleInputChange.bind(this);
    };
    handleInputChange(input){
        const inputValue = input.replace(/\W/g, "");
        this.setState({inputValue});
        return inputValue;
    }

    render() {
        const {loadOptions} = this.props;
        return (<div data-testid="asyncSelect"> <AysncSelect
            loadOption={loadOptions}
            onInputChange={this.handleInputChange} /> </div> )
    }
};