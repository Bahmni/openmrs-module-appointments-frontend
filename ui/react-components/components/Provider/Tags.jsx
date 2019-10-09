import React from "react";
import classNames from "classnames";
import {tag, tagHolder, tagLabel, tagRemove} from './Tags.module.scss'

import {map} from 'lodash';


const Tags = (props) => {

    const {selectedTags, onChange} = props;

    const removeTag = tagElement => {
        onChange(tagElement.target.parentElement.attributes['data-attr'].value);
    };

    return (
        selectedTags ? (<div className={classNames(tag)}>
            {
                map(selectedTags, (tag, index) => (
                    <div className={classNames(tagHolder)} data-attr={tag.id} key={index}>
                        <div className={classNames(tagLabel)}>{tag.label}</div>
                        <i onClick={removeTag} className={classNames("fa", "fa-times", tagRemove)}/>
                    </div>))
            }
        </div>) : null)
};

export default Tags;

