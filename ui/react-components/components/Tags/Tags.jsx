import React from "react";
import classNames from "classnames";
import { newTag, tagHolder, disable,customTagHolder} from './Tags.module.scss'
import './Tags.module.scss'
import {map} from 'lodash';
import PropTypes from "prop-types";
import { Tag } from 'carbon-components-react';

const Tags = (props) => {

    const {selectedTags, onChange, isDisabled, style=''} = props;

    const removeTag = (tag) => onChange(tag.value);

    return (
        selectedTags && selectedTags.length > 0 ? (<div>
            {
                map(selectedTags, (tagItem, index) => (
                    <div className={classNames(style===''?tagHolder:customTagHolder, isDisabled ? disable : '', newTag)} data-attr={tagItem.value} key={index}>
                        <Tag className={classNames(newTag)} filter={true} onClose={removeTag.bind(this, tagItem)}>{tagItem.label}</Tag>
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

