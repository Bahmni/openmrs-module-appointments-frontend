import {getTranslations} from "../../api/translationsApi";
import {appName} from '../../constants';
import {getAppConfigs} from "../../api/configApi";

export const getMessages = async locale => {
    return await getTranslations({appName: appName, locale: locale});
};

export const getAppConfig = async () => {
    const appConfigs = await getAppConfigs({appName: appName});
    const {config} = appConfigs;
    return config;
};
