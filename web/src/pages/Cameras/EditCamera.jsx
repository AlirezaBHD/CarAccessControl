    import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import { cameraAPI } from '../../services/api';
    import BackButton from "../../components/UI/BackButton.jsx";

const EditCamera = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ip: '',
        url: '',
        frameInterval: '',
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadCamera();
    }, [id]);

    const loadCamera = async () => {
        try {
            setInitialLoading(true);
            const response = await cameraAPI.getById(id);
            const camera = response.data;
            setFormData({
                ip: camera.ip || '',
                url: camera.url || '',
                frameInterval: camera.frameInterval || '',
            });
        } catch (err) {
            console.error('Error loading camera:', err);
            setErrors({ submit: t('cameras.errors.load_failed') });
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

        if (!formData.ip.trim()) {
            newErrors.ip = t('common.validation.required', { field: t('cameras.fields.ip') });
        } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.ip)) {
            newErrors.ip = t('common.validation.invalid_format', { field: t('cameras.fields.ip') });
        }

        if (!formData.url.trim()) {
            newErrors.url = t('common.validation.required', { field: t('cameras.fields.url') });
        }

        if (!formData.frameInterval) {
            newErrors.frameInterval = t('common.validation.required', { field: t('cameras.fields.frame_interval') });
        } else if (isNaN(formData.frameInterval) || parseInt(formData.frameInterval) <= 0) {
            newErrors.frameInterval = t('common.validation.positive_number', { field: t('cameras.fields.frame_interval') });
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
            await cameraAPI.update(id, {
                ...formData,
                frameInterval: parseInt(formData.frameInterval),
            });
            navigate('/cameras');
        } catch (err) {
            console.error('Error updating camera:', err);
            setErrors({ submit: t('cameras.errors.update_failed') });
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
                    <p className="mt-4 text-secondary">{t('cameras.loading_data')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('cameras.edit_title')}</h1>
                    <p className="text-secondary mt-2">{t('cameras.edit_subtitle')}</p>
                </div>
                <BackButton navigatePath='/cameras'/>
            </div>

            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold text-primary">{t('cameras.edit_form_title')}</h2>
                    <p className="text-sm text-gray-600 mt-1">{t('cameras.camera_id')}: {id}</p>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="ip" className="block text-sm font-medium text-secondary mb-2">
                                {t('cameras.fields.ip')} *
                            </label>
                            <input
                                type="text"
                                id="ip"
                                name="ip"
                                value={formData.ip}
                                onChange={handleChange}
                                className={inputClasses(errors.ip)}
                                placeholder="192.168.1.1"
                            />
                            {errors.ip && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.ip}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-secondary mb-2">
                                {t('cameras.fields.url')} *
                            </label>
                            <input
                                type="text"
                                id="url"
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                className={inputClasses(errors.url)}
                                placeholder="https://example.com/stream"
                            />
                            {errors.url && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.url}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="frameInterval" className="block text-sm font-medium text-secondary mb-2">
                                {t('cameras.fields.frame_interval')} *
                            </label>
                            <input
                                type="number"
                                id="frameInterval"
                                name="frameInterval"
                                value={formData.frameInterval}
                                onChange={handleChange}
                                className={inputClasses(errors.frameInterval)}
                                placeholder="1000"
                                min="1"
                            />
                            {errors.frameInterval && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.frameInterval}
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
                                onClick={() => navigate('/cameras')}
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
                                        {t('cameras.updating')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t('cameras.update_btn')}
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

export default EditCamera;