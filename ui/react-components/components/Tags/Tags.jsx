import React from "react";
import classNames from "classnames";
import {tag, tagHolder, tagLabel, tagRemove, disable,customTagHolder,customTag,customTagLabel,customTagRemove} from './Tags.module.scss'
import './Tags.module.scss'
import {map} from 'lodash';
import PropTypes from "prop-types";

const Tags = (props) => {

    const {selectedTags, onChange, isDisabled, style=''} = props;

    const removeTag = tagElement => {
        return onChange(tagElement.currentTarget.parentNode.attributes['data-attr'].value)};

    return (
        selectedTags && selectedTags.length > 0 ? (<div className={classNames(style===''?tag:customTag)}>
            {
                map(selectedTags, (tag, index) => (
                    <div className={classNames(style===''?tagHolder:customTagHolder, isDisabled ? disable : '')} data-attr={tag.value} key={index}>
                        <div className={classNames(style===''?tagLabel:customTagLabel)}>{tag.label}</div>
                        <span onClick={removeTag} className={classNames(style===''?tagRemove:customTagRemove)}><i className={classNames("fa", "fa-times")}/></span>
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

