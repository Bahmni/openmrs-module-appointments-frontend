import Dropdown from "../Dropdown/Dropdown.jsx";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {injectIntl} from 'react-intl';
import {getAllByTag} from "../../api/locationApi";
import {locationTagName} from "../../constants";
import {forEach} from 'lodash';
import {locationsResposne} from './locations'
import Tags from "../Tags/Tags.jsx";
import {searchFeildOnChangeHandler,searchFeildOnRemoveHandler} from '../../helper';

const LocationSearch = (props) => {

    const {intl, onChange, value, isDisabled, autoFocus} = props;
    const {showTags=false, openMenuOnClick=true, openMenuOnFocus=true, style='',components,customSelectStyle}=props

    const createDropdownOptions = (locations) => {
        const options = [];
        forEach(locations, function (location) {
            options.push({
                value: props.onChange?location:location.name,
                label: location.name
            });
        });
        return options;
    };

    const [locations, setLocations] = useState(createDropdownOptions(locationsResposne.results)); //loadLocations()
    const [selectedLocations, setSelectedLocations] = useState([]);

    useEffect(() => {
        if(props.onChange)
          setLocations(loadLocations());
    }, []);


    const loadLocations = async () => {
        const locations = await getAllByTag(locationTagName);
        setLocations(createDropdownOptions(locations));
    };

    const placeholder = intl.formatMessage({
        id: 'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_LOCATION', defaultMessage: 'Location'
    });

    const onChangeHandler = e => searchFeildOnChangeHandler(locations,setLocations,selectedLocations,setSelectedLocations,e)
    const onRemoveHandler = e => searchFeildOnRemoveHandler(locations,setLocations,selectedLocations,setSelectedLocations,e)    
    
    return (
        <div>
        <Dropdown
            isDisabled={isDisabled}
            options={Object.values(locations)}
            onChange={props.onChange?onChange:onChangeHandler}
            placeholder={placeholder}
            selectedValue={props.onChange?value:''}
            isClearable={true}
            autoFocus={autoFocus}
            openMenuOnClick={openMenuOnClick}
            openMenuOnFocus={openMenuOnFocus}
            style={style}
            components={components}
            customSelectStyle={customSelectStyle}
        />
        {showTags?
        <Tags
            onChange={onRemoveHandler}
            isDisabled={isDisabled}
            selectedTags={selectedLocations}
            style={style}
        />:null
        }
        </div>
        );
};

LocationSearch.propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object,
    isDisabled: PropTypes.bool,
    autoFocus: PropTypes.bool
};

export default injectIntl(LocationSearch);
