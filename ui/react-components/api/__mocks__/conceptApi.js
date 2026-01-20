const concepts = [
    { uuid: 'reason-1-uuid', display: 'Fever' },
    { uuid: 'reason-2-uuid', display: 'Headache' },
    { uuid: 'reason-3-uuid', display: 'Cough' }
];

export const searchConcepts = (conceptSet, searchTerm) => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
            resolve(concepts)
        );
    });
};

export const getConceptByUuid = (conceptUuid) => {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            const concept = concepts.find(c => c.uuid === conceptUuid);
            resolve(concept || {});
        });
    });
};
