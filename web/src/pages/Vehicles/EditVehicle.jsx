import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import { vehicleAPI, vehicleOwnerAPI } from '../../services/api';
import BackButton from "../../components/UI/BackButton.jsx";

const EditVehicle = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        plateNumber: '',
        ownerId: '',
    });
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [ownersLoading, setOwnersLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setInitialLoading(true);
            const [vehicleResponse, ownersResponse] = await Promise.all([
                vehicleAPI.getById(id),
                vehicleOwnerAPI.getAll()
            ]);

            const vehicle = vehicleResponse.data;
            setFormData({
                name: vehicle.name || '',
                plateNumber: vehicle.plateNumber || '',
                ownerId: vehicle.ownerId ? vehicle.ownerId.toString() : '',
            });

            setOwners(ownersResponse.data);
        } catch (err) {
            console.error('Error loading data:', err);
            setErrors({ submit: t('vehicles.errors.load_details_failed') });
        } finally {
            setInitialLoading(false);
            setOwnersLoading(false);
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

        if (!formData.name.trim()) {
            newErrors.name = t('common.validation.required', { field: t('vehicles.fields.name') });
        } else if (formData.name.length < 2) {
            newErrors.name = t('common.validation.min_length', { field: t('vehicles.fields.name'), count: 2 });
        } else if (formData.name.length > 100) {
            newErrors.name = t('common.validation.max_length', { field: t('vehicles.fields.name'), count: 100 });
        }

        if (!formData.plateNumber.trim()) {
            newErrors.plateNumber = t('common.validation.required', { field: t('vehicles.fields.plate_number') });
        } else if (formData.plateNumber.length < 7 || formData.plateNumber.length > 10) {
            newErrors.plateNumber = t('common.validation.min_length', { field: t('vehicles.fields.plate_number'), count: 7 });
        }

        if (!formData.ownerId) {
            newErrors.ownerId = t('common.validation.required', { field: t('vehicles.fields.owner') });
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
            await vehicleAPI.update(id, {
                ...formData,
                ownerId: parseInt(formData.ownerId),
            });
            navigate('/vehicles');
        } catch (err) {
            console.error('Error updating vehicle:', err);
            setErrors({ submit: t('vehicles.errors.update_failed') });
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

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-secondary">{t('vehicles.loading_data')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('vehicles.edit_title')}</h1>
                    <p className="text-secondary mt-2">{t('vehicles.edit_subtitle')}</p>
                </div>
                <BackButton navigatePath='/vehicles'/>
            </div>

            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold text-primary">{t('vehicles.form_edit')}</h2>
                    <p className="text-sm text-gray-600 mt-1">{t('vehicles.vehicle_id')}: {id}</p>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
                                {t('vehicles.fields.name')} *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClasses(errors.name)}
                                placeholder={t('vehicles.placeholders.name')}
                                maxLength={100}
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
                            <label htmlFor="plateNumber" className="block text-sm font-medium text-secondary mb-2">
                                {t('vehicles.fields.plate_number')} *
                            </label>
                            <input
                                type="text"
                                id="plateNumber"
                                name="plateNumber"
                                value={formData.plateNumber}
                                onChange={handleChange}
                                className={inputClasses(errors.plateNumber)}
                                placeholder={t('vehicles.placeholders.plate_number')}
                                maxLength={10}
                            />
                            {errors.plateNumber && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.plateNumber}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="ownerId" className="block text-sm font-medium text-secondary mb-2">
                                {t('vehicles.fields.owner')} *
                            </label>
                            <select
                                id="ownerId"
                                name="ownerId"
                                value={formData.ownerId}
                                onChange={handleChange}
                                className={selectClasses(errors.ownerId)}
                                disabled={ownersLoading}
                            >
                                <option value="">{t('vehicles.owner_select')}</option>
                                {owners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>
                                        {owner.firstName} {owner.sureName} - {owner.nationalCode}
                                    </option>
                                ))}
                            </select>
                            {errors.ownerId && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.ownerId}
                                </p>
                            )}
                            {ownersLoading && (
                                <p className="mt-2 text-sm text-gray-500">{t('vehicles.loading_owners')}</p>
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
                                onClick={() => navigate('/vehicles')}
                                disabled={loading}
                                className="flex-1"
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || ownersLoading}
                                className="flex-1 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ms-2"></div>
                                        {t('vehicles.updating')}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {t('vehicles.update_btn')}
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

export default EditVehicle;