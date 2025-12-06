import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import { vehicleOwnerAPI } from '../../services/api';
import BackButton from "../../components/UI/BackButton.jsx";

const EditOwner = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        sureName: '',
        nationalCode: '',
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadOwner();
    }, [id]);

    const loadOwner = async () => {
        try {
            setInitialLoading(true);
            const response = await vehicleOwnerAPI.getById(id);
            const owner = response.data;
            setFormData({
                firstName: owner.firstName || '',
                sureName: owner.sureName || '',
                nationalCode: owner.nationalCode || '',
            });
        } catch (err) {
            console.error('Error loading owner:', err);
            setErrors({ submit: t('owners.errors.load_details') });
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = t('common.validation.required', { field: t('owners.fields.first_name') });
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = t('common.validation.min_length', { field: t('owners.fields.first_name'), count: 2 });
        }

        if (!formData.sureName.trim()) {
            newErrors.sureName = t('common.validation.required', { field: t('owners.fields.last_name') });
        } else if (formData.sureName.length < 2) {
            newErrors.sureName = t('common.validation.min_length', { field: t('owners.fields.last_name'), count: 2 });
        }

        if (formData.nationalCode && !/^\d{10}$/.test(formData.nationalCode)) {
            newErrors.nationalCode = t('common.validation.exact_length', { field: t('owners.fields.national_code'), count: 10 });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await vehicleOwnerAPI.update(id, formData);
            navigate('/owners');
        } catch (err) {
            console.error('Error updating owner:', err);
            setErrors({ submit: t('owners.errors.update_failed') });
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (hasError) => `
        w-full px-4 py-3 border rounded-xl text-black focus:outline-none focus:ring-2 transition-all duration-200 dir-ltr text-start
        ${hasError
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-primary focus:border-primary'
    }
    `;

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-secondary">{t('owners.loading_details')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('owners.edit_title')}</h1>
                    <p className="text-secondary mt-2">{t('owners.edit_subtitle')}</p>
                </div>
                <BackButton navigatePath='/owners'/>
            </div>

            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold text-primary">{t('owners.edit_form_title')}</h2>
                    <p className="text-sm text-gray-600 mt-1">{t('owners.owner_id')}: {id}</p>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-secondary mb-2">
                                {t('owners.fields.first_name')} *
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={inputClasses(errors.firstName)}
                                placeholder={t('owners.placeholders.first_name')}
                                maxLength={50}
                            />
                            {errors.firstName && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="sureName" className="block text-sm font-medium text-secondary mb-2">
                                {t('owners.fields.last_name')} *
                            </label>
                            <input
                                type="text"
                                id="sureName"
                                name="sureName"
                                value={formData.sureName}
                                onChange={handleChange}
                                className={inputClasses(errors.sureName)}
                                placeholder={t('owners.placeholders.last_name')}
                                maxLength={50}
                            />
                            {errors.sureName && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.sureName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="nationalCode" className="block text-sm font-medium text-secondary mb-2">
                                {t('owners.fields.national_code')}
                            </label>
                            <input
                                type="text"
                                id="nationalCode"
                                name="nationalCode"
                                value={formData.nationalCode}
                                onChange={handleChange}
                                className={inputClasses(errors.nationalCode)}
                                placeholder={t('owners.placeholders.national_code')}
                                maxLength={10}
                            />
                            {errors.nationalCode && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.nationalCode}
                                </p>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-red-600 flex items-center">
                                    <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.submit}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/owners')}
                                disabled={loading}
                                className="flex-1"
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ms-2"></div>
                                        {t('owners.updating')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t('owners.update_btn')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default EditOwner;