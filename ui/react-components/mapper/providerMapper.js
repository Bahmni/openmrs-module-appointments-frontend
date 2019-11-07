export const getProviderDropDownOptions = (providers) => {
    return providers.map(provider => {
        return {
            label: provider.name,
            value: provider.uuid,
            comments: provider.comments,
            response: provider.response
        }
    });
};
