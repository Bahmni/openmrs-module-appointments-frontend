import React from 'react';
import axios from 'axios';
import {searchPatientUrl} from '../constants';

export const getPatientsByLocation =(locationUuid, searchQuery, startIndex=0)=>{
    return axios
        .get(`${searchPatientUrl}?loginLocationUuid=${locationUuid}&q=${searchQuery}&startIndex=${startIndex}`);
};