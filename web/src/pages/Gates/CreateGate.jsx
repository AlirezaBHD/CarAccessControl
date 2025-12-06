import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import { gateAPI, cameraAPI } from '../../services/api';
import BackButton from "../../components/UI/BackButton.jsx";

const CreateGate = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        isActive: true,
        cameraId: '',
    });
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(false);
    const [camerasLoading, setCamerasLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadCameras();
    }, []);

    const loadCameras = async () => {
        try {
            setCamerasLoading(true);
            const response = await cameraAPI.getAll();
            setCameras(response.data);
        } catch (err) {
            console.error('Error loading cameras:', err);
            setErrors({ submit: t('gates.errors.load_cameras') });
        } finally {
            setCamerasLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
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

        if (!formData.name.trim()) {
            newErrors.name = t('common.validation.required', { field: t('gates.fields.name') });
        } else if (formData.name.length < 2) {
            newErrors.name = t('common.validation.min_length', { field: t('gates.fields.name'), count: 2 });
        } else if (formData.name.length > 200) {
            newErrors.name = t('common.validation.max_length', { field: t('gates.fields.name'), count: 200 });
        }

        if (!formData.location.trim()) {
            newErrors.location = t('common.validation.required', { field: t('gates.fields.location') });
        } else if (formData.location.length < 2) {
            newErrors.location = t('common.validation.min_length', { field: t('gates.fields.location'), count: 2 });
        } else if (formData.location.length > 200) {
            newErrors.location = t('common.validation.max_length', { field: t('gates.fields.location'), count: 200 });
        }

        if (!formData.cameraId) {
            newErrors.cameraId = t('common.validation.required', { field: t('gates.fields.connected_camera') });
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
            await gateAPI.create({
                ...formData,
                cameraId: parseInt(formData.cameraId),
            });
            navigate('/gates');
        } catch (err) {
            console.error('Error creating gate:', err);
            setErrors({ submit: t('gates.errors.create_failed') });
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

    const selectClasses = (hasError) => `
        w-full px-4 py-3 border rounded-xl text-black focus:outline-none focus:ring-2 transition-all duration-200 bg-white dir-ltr text-start
        ${hasError
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-primary focus:border-primary'
    }
    `;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('gates.create_title')}</h1>
                    <p className="text-secondary mt-2">{t('gates.create_subtitle')}</p>
                </div>
                <BackButton navigatePath='/gates'/>
            </div>

            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold text-primary">{t('gates.form_title')}</h2>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
                                {t('gates.fields.name')} *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClasses(errors.name)}
                                placeholder={t('gates.placeholders.name')}
                                maxLength={200}
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-secondary mb-2">
                                {t('gates.fields.location')} *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className={inputClasses(errors.location)}
                                placeholder={t('gates.placeholders.location')}
                                maxLength={200}
                            />
                            {errors.location && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.location}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="cameraId" className="block text-sm font-medium text-secondary mb-2">
                                {t('gates.fields.connected_camera')} *
                            </label>
                            <select
                                id="cameraId"
                                name="cameraId"
                                value={formData.cameraId}
                                onChange={handleChange}
                                className={selectClasses(errors.cameraId)}
                                disabled={camerasLoading}
                            >
                                <option value="">{t('gates.camera_select')}</option>
                                {cameras.map((camera) => (
                                    <option key={camera.id} value={camera.id}>
                                        {camera.name || `Camera ${camera.id}`} - {camera.ip}
                                    </option>
                                ))}
                            </select>
                            {errors.cameraId && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.cameraId}
                                </p>
                            )}
                            {camerasLoading && (
                                <p className="mt-2 text-sm text-gray-500">{t('gates.loading_cameras')}</p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                            />
                            <label htmlFor="isActive" className="ms-2 text-sm font-medium text-secondary">
                                {t('gates.fields.is_active')}
                            </label>
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
                                onClick={() => navigate('/gates')}
                                disabled={loading}
                                className="flex-1"
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || camerasLoading}
                                className="flex-1 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ms-2"></div>
                                        {t('gates.creating')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t('gates.create_btn')}
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

export default CreateGate;