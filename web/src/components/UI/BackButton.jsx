import React from 'react';
import Button from "./Button.jsx";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const BackButton = ({navigatePath}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <Button
            variant="outline"
            onClick={() => navigate(navigatePath)}
            className="flex items-center"
        >
            <svg className="rtl:hidden w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('common.back_list')}
            <svg className="ltr:hidden w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </Button>
    );
};

export default BackButton;