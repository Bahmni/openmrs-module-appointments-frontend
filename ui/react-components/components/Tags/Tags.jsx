import React from "react";
import classNames from "classnames";
import {tag, tagHolder, tagLabel, tagRemove, disable} from './Tags.module.scss'

import {map} from 'lodash';
import PropTypes from "prop-types";

const Tags = (props) => {

    const {selectedTags, onChange, isDisabled} = props;

    const removeTag = tagElement => onChange(tagElement.target.parentElement.attributes['data-attr'].value);

    return (
        selectedTags && selectedTags.length > 0 ? (<div className={classNames(tag)}>
            {
                map(selectedTags, (tag, index) => (
                    <div className={classNames(tagHolder, isDisabled ? disable : '')} data-attr={tag.value} key={index}>
                        <div className={classNames(tagLabel)}>{tag.label}</div>
                        <i onClick={removeTag} className={classNames("fa", "fa-times", tagRemove)}/>
                    </div>))
            }
        </div>) : null)
};

Tags.propTypes = {
    onChange: PropTypes.func.isRequired,
    selectedTags: PropTypes.array,
    isDisabled: PropTypes.bool
};

export default Tags;

