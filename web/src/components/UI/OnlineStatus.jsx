import React from 'react';
import {useTranslation} from "react-i18next";

const OnlineStatus = ({ lastUpdate, isUpdating }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center space-x-2 pl-3 space-x-reverse text-sm">
            <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-gray-600">
        {isUpdating ? t('common.updating') : t('common.online')}
      </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 pr-1">
        {t('common.last_update')}:  {lastUpdate}
      </span>
        </div>
    );
};

export default OnlineStatus;