import _ from 'lodash';

export const mergeObjects = (object1, object2) => {
    const removeEmptyObjects = (currentObject) => {
        _.forOwn(currentObject, function (value, key) {
            if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
                (_.isObject(value) && _.isNull(removeEmptyObjects(value)))) {
                delete currentObject[key];
            }
        });
        return currentObject;
    };

    return removeEmptyObjects(_.merge(
        {}, object1, object2));
};
